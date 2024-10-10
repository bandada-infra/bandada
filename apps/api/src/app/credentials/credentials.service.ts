import {
    validateCredentials,
    validateManyCredentials,
    getProvider,
    BlockchainProvider,
    Web2Provider,
    providers,
    Web2Context,
    BlockchainContext,
    EASContext
} from "@bandada/credentials"
import { blockchainCredentialSupportedNetworks } from "@bandada/utils"
import { id } from "@ethersproject/hash"
import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { v4 } from "uuid"
import { GroupsService } from "../groups/groups.service"
import { OAuthAccount } from "./entities/credentials-account.entity"
import { OAuthState } from "./types"

@Injectable()
export class CredentialsService {
    private oAuthState: Map<string, OAuthState>

    constructor(
        @InjectRepository(OAuthAccount)
        private readonly oAuthAccountRepository: Repository<OAuthAccount>,
        @Inject(forwardRef(() => GroupsService))
        private readonly groupsService: GroupsService
    ) {
        this.oAuthState = new Map()
    }

    /*
     * It generates a random string for the OAuth state to prevent forgery attacks.
     * @param oAuthState OAuth state (group id, member id and a provider).
     * @returns The random string created for the OAuth state.
     */
    async setOAuthState(oAuthState: OAuthState): Promise<string> {
        const group = await this.groupsService.getGroup(oAuthState.groupId)

        if (!group.credentials) {
            throw new BadRequestException(
                `Group with id '${oAuthState.groupId}' is not a credential group`
            )
        }

        if (!providers.map((p) => p.name).includes(oAuthState.providerName)) {
            throw new BadRequestException(
                `OAuth provider '${oAuthState.providerName}' is not supported`
            )
        }

        if (
            this.groupsService.isGroupMember(
                oAuthState.groupId,
                oAuthState.memberId
            )
        ) {
            throw new BadRequestException(
                `Member '${oAuthState.memberId}' already exists in the group '${oAuthState.groupId}'`
            )
        }

        const stateId = v4()

        this.oAuthState.set(stateId, oAuthState)

        return stateId
    }

    /**
     * Add a member to the credential group if they meet the right credential criteria.
     * @param OAuthState OAuth state to prevent forgery attacks.
     * @param oAuthCode OAuth code to exchange for an access token.
     * @param address Account address.
     * @returns Redirect URI
     */
    async addMember(
        oAuthState: string[],
        oAuthCode?: string[],
        address?: string[]
    ): Promise<string> {
        if (!this.oAuthState.has(oAuthState[0])) {
            throw new BadRequestException(`OAuth state does not exist`)
        }

        let {
            groupId,
            memberId,
            providerName,
            redirectUri: clientRedirectUri
        } = this.oAuthState.get(oAuthState[0])

        const group = await this.groupsService.getGroup(groupId)

        if (group.credentials === null) return

        const credentials = JSON.parse(group.credentials)

        if (
            credentials.credentials !== undefined &&
            credentials.expression !== undefined
        ) {
            // The group has multiple credentials

            const contexts = []
            let accountHash: string

            for (let i = 0; i < credentials.credentials.length; i += 1) {
                // Get the name of the provider of the credential
                const credentialProvider = credentials.credentials[i].id
                    .split("_")[0]
                    .toLowerCase()

                // Find the OAuthState for this credential provider
                const credentialOAuthState = oAuthState.find(
                    (s) =>
                        this.oAuthState.get(s).providerName ===
                        credentialProvider
                )

                if (credentialOAuthState === undefined) {
                    return
                }

                // Get the oAuthState data for this credential
                ;({
                    groupId,
                    memberId,
                    providerName,
                    redirectUri: clientRedirectUri
                } = this.oAuthState.get(credentialOAuthState))
                const provider = getProvider(providerName)

                let context: Web2Context | BlockchainContext | EASContext

                if (address && credentialProvider === "blockchain") {
                    const { network } = credentials.credentials[i].criteria

                    const supportedNetwork =
                        blockchainCredentialSupportedNetworks.find(
                            (n) =>
                                n.name.toLowerCase() === network.toLowerCase()
                        )

                    if (supportedNetwork === undefined)
                        throw new BadRequestException(
                            `The network is not supported`
                        )

                    const networkEnvVariableName =
                        supportedNetwork.id.toUpperCase()

                    const web3providerRpcURL =
                        process.env[`${networkEnvVariableName}_RPC_URL`]

                    // eslint-disable-next-line no-await-in-loop
                    const jsonRpcProvider = await (
                        provider as BlockchainProvider
                    ).getJsonRpcProvider(web3providerRpcURL)

                    context = {
                        address: address[0],
                        jsonRpcProvider
                    }

                    // Check if the same account has already joined the group.
                    accountHash = id(address + groupId)
                } else if (address && credentialProvider === "eas") {
                    context = {
                        address: address[0]
                    }

                    // Check if the same account has already joined the group.
                    accountHash = id(address + groupId)
                } else {
                    const clientId =
                        process.env[`${providerName.toUpperCase()}_CLIENT_ID`]
                    const clientSecret =
                        process.env[
                            `${providerName.toUpperCase()}_CLIENT_SECRET`
                        ]
                    const redirectUri =
                        process.env[
                            `${providerName.toUpperCase()}_REDIRECT_URI`
                        ]

                    // Exchange the OAuth code for a valid access token.
                    // eslint-disable-next-line no-await-in-loop
                    const accessToken = await (
                        provider as Web2Provider
                    ).getAccessToken(
                        clientId,
                        clientSecret,
                        oAuthCode[0],
                        oAuthState[0],
                        redirectUri
                    )

                    // eslint-disable-next-line no-await-in-loop
                    const profile = await (provider as Web2Provider).getProfile(
                        accessToken
                    )

                    context = {
                        profile,
                        accessTokens: { [providerName]: accessToken }
                    }

                    // Check if the same account has already joined the group.
                    accountHash = id(profile.id + groupId)
                }

                if (
                    group.oAuthAccounts.find(
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        (account) => account.accountHash === accountHash
                    )
                ) {
                    throw new BadRequestException(
                        "OAuth account has already joined the group"
                    )
                }

                contexts.push(context)
            }

            // Check credentials.
            if (
                !(await validateManyCredentials(
                    credentials.credentials,
                    contexts,
                    credentials.expression
                ))
            ) {
                throw new UnauthorizedException(
                    "OAuth account does not match criteria"
                )
            }

            // Save OAuth account to prevent the same account to join groups with
            // different member ids.
            const oAuthAccount = new OAuthAccount()

            oAuthAccount.group = group
            oAuthAccount.accountHash = accountHash

            await this.oAuthAccountRepository.save(oAuthAccount)
            await this.groupsService.addMember(groupId, memberId)

            for (let i = 0; i < oAuthState.length; i += 1) {
                this.oAuthState.delete(oAuthState[i])
            }

            return clientRedirectUri
        }

        const provider = getProvider(providerName)

        let accountHash: string

        let context: Web2Context | BlockchainContext | EASContext

        if (address) {
            const { network, minAttestations } = JSON.parse(
                group.credentials
            ).criteria

            if (network && !minAttestations) {
                const supportedNetwork =
                    blockchainCredentialSupportedNetworks.find(
                        (n) => n.name.toLowerCase() === network.toLowerCase()
                    )

                if (supportedNetwork === undefined)
                    throw new BadRequestException(
                        `The network is not supported`
                    )

                const networkEnvVariableName = supportedNetwork.id.toUpperCase()

                const web3providerRpcURL =
                    process.env[`${networkEnvVariableName}_RPC_URL`]

                const jsonRpcProvider = await (
                    provider as BlockchainProvider
                ).getJsonRpcProvider(web3providerRpcURL)

                context = {
                    address: address[0],
                    jsonRpcProvider
                }
            }

            if (network && minAttestations) {
                context = {
                    address: address[0]
                }
            }

            // Check if the same account has already joined the group.
            accountHash = id(address + groupId)
        } else {
            const clientId =
                process.env[`${providerName.toUpperCase()}_CLIENT_ID`]
            const clientSecret =
                process.env[`${providerName.toUpperCase()}_CLIENT_SECRET`]
            const redirectUri =
                process.env[`${providerName.toUpperCase()}_REDIRECT_URI`]

            // Exchange the OAuth code for a valid access token.
            const accessToken = await (provider as Web2Provider).getAccessToken(
                clientId,
                clientSecret,
                oAuthCode[0],
                oAuthState[0],
                redirectUri
            )

            const profile = await (provider as Web2Provider).getProfile(
                accessToken
            )

            context = {
                profile,
                accessTokens: { [providerName]: accessToken }
            }

            // Check if the same account has already joined the group.
            accountHash = id(profile.id + groupId)
        }

        if (
            group.oAuthAccounts.find(
                (account) => account.accountHash === accountHash
            )
        ) {
            throw new BadRequestException(
                "OAuth account has already joined the group"
            )
        }

        // Check credentials.
        if (
            !(await validateCredentials(JSON.parse(group.credentials), context))
        ) {
            throw new UnauthorizedException(
                "OAuth account does not match criteria"
            )
        }

        // Save OAuth account to prevent the same account to join groups with
        // different member ids.
        const oAuthAccount = new OAuthAccount()

        oAuthAccount.group = group
        oAuthAccount.accountHash = accountHash

        await this.oAuthAccountRepository.save(oAuthAccount)
        await this.groupsService.addMember(groupId, memberId)

        this.oAuthState.delete(oAuthState[0])

        return clientRedirectUri
    }
}
