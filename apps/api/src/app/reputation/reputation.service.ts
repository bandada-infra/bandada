import { validateReputation, getProvider } from "@bandada/reputation"
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
import { ReputationAccount } from "./entities/reputation-account.entity"
import { OAuthState } from "./types"

@Injectable()
export class ReputationService {
    private oAuthState: Map<string, OAuthState>

    constructor(
        @InjectRepository(ReputationAccount)
        private readonly reputationAccountRepository: Repository<ReputationAccount>,
        @Inject(forwardRef(() => GroupsService))
        private readonly groupsService: GroupsService
    ) {
        this.oAuthState = new Map()
    }

    /**
     * It generates a random string for the OAuth state to prevent forgery attacks.
     * @param oAuthState OAuth state (group id, member id and a provider).
     * @returns The random string created for the OAuth state.
     */
    async setOAuthState(oAuthState: OAuthState): Promise<string> {
        const group = await this.groupsService.getGroup(oAuthState.groupId)

        if (!group.reputationCriteria) {
            throw new BadRequestException(
                `Group with id '${oAuthState.groupId}' is not a reputation group`
            )
        }

        if (!["github", "twitter"].includes(oAuthState.providerName)) {
            throw new BadRequestException(
                `OAuth provider ${oAuthState.providerName}' is not supported`
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
     * Add a member to the reputation group if they meet the right reputation criteria.
     * @param oAuthCode OAuth code to exchange for an access token.
     * @param OAuthState OAuth state to prevent forgery attacks.
     * @returns Redirect URI
     */
    async addMember(oAuthCode: string, oAuthState: string): Promise<string> {
        if (!this.oAuthState.has(oAuthState)) {
            throw new BadRequestException(`OAuth state does not exist`)
        }

        const {
            groupId,
            memberId,
            providerName,
            redirectUri: clientRedirectUri
        } = this.oAuthState.get(oAuthState)

        const group = await this.groupsService.getGroup(groupId)

        const provider = getProvider(providerName)
        const clientId = process.env[`${providerName.toUpperCase()}_CLIENT_ID`]
        const clientSecret =
            process.env[`${providerName.toUpperCase()}_CLIENT_SECRET`]
        const redirectUri =
            process.env[`${providerName.toUpperCase()}_REDIRECT_URI`]

        // Exchange the OAuth code for a valid access token.
        const accessToken = await provider.getAccessToken(
            clientId,
            clientSecret,
            oAuthCode,
            oAuthState,
            redirectUri
        )

        const profile = await provider.getProfile(accessToken)

        // Check if the same account has already joined a group.
        const accountHash = id(profile.id + provider)

        if (
            group.reputationAccounts.find(
                (account) => account.accountHash === accountHash
            )
        ) {
            throw new BadRequestException(
                "OAuth account has already joined a group"
            )
        }

        // Check reputation.
        if (
            !(await validateReputation(group.reputationCriteria, {
                profile,
                accessTokens: { [providerName]: accessToken }
            }))
        ) {
            throw new UnauthorizedException(
                "OAuth account does not match reputation criteria"
            )
        }

        // Save OAuth account to prevent the same account to join groups with
        // different member ids.
        const reputationAccount = new ReputationAccount()

        reputationAccount.group = group
        reputationAccount.accountHash = accountHash

        await this.reputationAccountRepository.save(reputationAccount)
        await this.groupsService.addMember(groupId, memberId)

        this.oAuthState.delete(oAuthState)

        return clientRedirectUri
    }
}
