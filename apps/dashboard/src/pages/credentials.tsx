import {
    getProvider,
    blockchain,
    Web2Provider,
    twitter,
    github,
    eas
} from "@bandada/credentials"
import { Flex, Text, Button } from "@chakra-ui/react"
import { useEffect, useState, useCallback, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { shortenAddress } from "@bandada/utils"
import {
    addMemberByCredentials,
    setOAuthState,
    getGroup
} from "../api/bandadaAPI"
import { AuthContext } from "../context/auth-context"

// Local storage key to save information related to groups with multiple credentials
const LOCAL_STORAGE = "bandada_credentials"

// Function to generate the right link for the credential groups
function generateUrl(providerName: string, groupId: string, memberId: string) {
    return `credentials?group=${groupId}&member=${memberId}&provider=${providerName}&type=multiple`
}

// Related to groups with multiple credentials
// Function to return the next url that should be evaluated
// using the providers saved in local storage
function getUrlNextEmpty(groupId: string, memberId: string) {
    const bandadaCredentials = localStorage.getItem(LOCAL_STORAGE)
    if (!bandadaCredentials) return null
    const providers = JSON.parse(bandadaCredentials)

    for (let i = 0; i < providers.length; i += 1) {
        if (providers[i].length === 0) {
            return generateUrl(providers[i], groupId, memberId)
        }
    }
    return null
}

// Related to groups with multiple credentials
// Function to evaluate many credentials
async function validateCredentials() {
    const bandadaCredentials = localStorage.getItem(LOCAL_STORAGE)
    if (!bandadaCredentials) return null
    const providers = JSON.parse(bandadaCredentials)

    const states = []
    const codes = []
    const addresses = []

    for (let i = 0; i < Object.keys(providers).length; i += 1) {
        const state =
            providers[Object.keys(providers)[i]][0] !== null
                ? providers[Object.keys(providers)[i]][0]
                : ""
        const code =
            providers[Object.keys(providers)[i]][1] !== null
                ? providers[Object.keys(providers)[i]][1]
                : ""
        const address =
            providers[Object.keys(providers)[i]][2] !== null
                ? providers[Object.keys(providers)[i]][2]
                : ""
        states.push(state)
        codes.push(code)
        addresses.push(address)
    }

    const clientRedirectUri = await addMemberByCredentials(
        states,
        codes,
        addresses
    )

    // Remove the key in local storage used to save information
    // about groups with multiple credentials
    localStorage.removeItem(LOCAL_STORAGE)

    return clientRedirectUri
}

export default function CredentialsPage() {
    const [_searchParams] = useSearchParams()
    const [_message, setMessage] = useState<string>(
        "Joining credential group..."
    )

    const { address } = useAccount()
    const { openConnectModal } = useConnectModal()
    const { openAccountModal } = useAccountModal()
    const [isBlockchain, setIsBlockchain] = useState(false)

    const { admin } = useContext(AuthContext)

    const isLoggedInAdmin = useCallback(
        () => admin && admin.address === address,
        [address, admin]
    )

    useEffect(() => {
        const groupType = _searchParams.get("type") || undefined
        const groupId = _searchParams.get("group")
        const memberId = _searchParams.get("member")
        const providerName = _searchParams.get("provider")
        ;(async () => {
            if (_searchParams.has("group") && _searchParams.has("member")) {
                const clientRedirectUri =
                    _searchParams.get("redirect_uri") || undefined

                setIsBlockchain(providerName === blockchain.name)

                // If the group has many credentials
                if (groupType === "multiple" && !providerName) {
                    if (!groupId || !memberId) return

                    // Get the group info
                    const group = await getGroup(groupId)

                    let groupCredentials: any

                    if (group?.credentials) {
                        // Get the group credentials
                        groupCredentials = JSON.parse(group.credentials)
                    }

                    if (!groupCredentials) return

                    // The temporal data is saved in the browser local storage
                    const bandadaCredentials =
                        localStorage.getItem(LOCAL_STORAGE)

                    // Clean the value of the variable that will
                    // save the data
                    if (bandadaCredentials) {
                        localStorage.setItem(LOCAL_STORAGE, "")
                    }

                    // Check if the browser has any data saved, if not, save
                    // the possible providers
                    // and start generating the urls

                    const data: any = {}

                    for (
                        let i = 0;
                        i < groupCredentials.credentials.length;
                        i += 1
                    ) {
                        // Get the provider to save it to the browser with an empty value.
                        const provider = groupCredentials.credentials[i].id
                            .split("_")[0]
                            .toLowerCase()
                        data[provider] = []
                    }

                    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(data))

                    const firstProvider = groupCredentials.credentials[0].id
                        .split("_")[0]
                        .toLowerCase()

                    const url = generateUrl(firstProvider, groupId, memberId)
                    window.location.replace(url)
                }

                const state = await setOAuthState(
                    groupId as string,
                    memberId as string,
                    providerName as string,
                    clientRedirectUri
                )

                // If the credential is blockchain
                if (
                    providerName === blockchain.name &&
                    isLoggedInAdmin() &&
                    state
                ) {
                    if (state && admin) {
                        if (groupType) {
                            const bandadaCredentials =
                                localStorage.getItem(LOCAL_STORAGE)
                            if (!bandadaCredentials) return null
                            const providers = JSON.parse(bandadaCredentials)
                            providers[providerName] = [
                                state,
                                undefined,
                                admin.address
                            ]
                            localStorage.setItem(
                                LOCAL_STORAGE,
                                JSON.stringify(providers)
                            )
                            if (!groupId || !memberId) return
                            const url = getUrlNextEmpty(groupId, memberId)

                            if (url === null) {
                                const clientRedirectUrl =
                                    await validateCredentials()
                                if (clientRedirectUrl) {
                                    window.location.replace(clientRedirectUrl)
                                } else {
                                    setMessage("You have joined the group!")
                                }
                                return
                            }

                            window.location.replace(url)
                        }

                        const redirectUrl = await addMemberByCredentials(
                            [state],
                            undefined,
                            [admin.address]
                        )

                        if (redirectUrl) {
                            window.location.replace(redirectUrl)
                        } else {
                            setMessage("You have joined the group!")
                        }
                    }
                }

                // If the credential is EAS
                if (
                    providerName === eas.name &&
                    isLoggedInAdmin() &&
                    state &&
                    admin
                ) {
                    if (groupType) {
                        const bandadaCredentials =
                            localStorage.getItem(LOCAL_STORAGE)
                        if (!bandadaCredentials) return null
                        const providers = JSON.parse(bandadaCredentials)
                        providers[providerName] = [
                            state,
                            undefined,
                            admin.address
                        ]
                        localStorage.setItem(
                            LOCAL_STORAGE,
                            JSON.stringify(providers)
                        )
                        if (!groupId || !memberId) return
                        const url = getUrlNextEmpty(groupId, memberId)

                        if (url === null) {
                            const clientRedirectUrl =
                                await validateCredentials()
                            if (clientRedirectUrl) {
                                window.location.replace(clientRedirectUrl)
                            } else {
                                setMessage("You have joined the group!")
                            }
                            return
                        }

                        window.location.replace(url)
                    }

                    const redirectUrl = await addMemberByCredentials(
                        [state],
                        undefined,
                        [admin.address]
                    )

                    if (redirectUrl) {
                        window.location.replace(redirectUrl)
                    } else {
                        setMessage("You have joined the group!")
                    }
                }

                // If it is a web2 credential. This is the first request for web2 credentials
                if (
                    (providerName === twitter.name ||
                        providerName === github.name) &&
                    state
                ) {
                    const clientId = import.meta.env[
                        `VITE_${providerName?.toUpperCase()}_CLIENT_ID`
                    ]
                    const redirectUri = import.meta.env[
                        `VITE_${providerName?.toUpperCase()}_REDIRECT_URI`
                    ]

                    const provider = getProvider(providerName as string)

                    const authUrl = (provider as Web2Provider).getAuthUrl(
                        clientId,
                        state,
                        redirectUri
                    )

                    window.location.replace(authUrl)
                }
            }

            // Second request for the web2 credential. The web2 credential is validated
            if (_searchParams.has("code") && _searchParams.has("state")) {
                const oAuthCode = _searchParams.get("code") as string
                const oAuthState = _searchParams.get("state") as string

                if (groupType) {
                    const bandadaCredentials =
                        localStorage.getItem(LOCAL_STORAGE)
                    if (!bandadaCredentials) return null
                    const providers = JSON.parse(bandadaCredentials)
                    if (providerName === null) return
                    providers[providerName] = [oAuthState, oAuthCode]
                    localStorage.setItem(
                        LOCAL_STORAGE,
                        JSON.stringify(providers)
                    )
                    if (!groupId || !memberId) return
                    const url = getUrlNextEmpty(groupId, memberId)

                    if (url === null) {
                        const clientRedirectUrl = await validateCredentials()
                        if (clientRedirectUrl) {
                            window.location.replace(clientRedirectUrl)
                        } else {
                            setMessage("You have joined the group!")
                        }
                        return
                    }

                    window.location.replace(url)
                }

                const clientRedirectUri = await addMemberByCredentials(
                    [oAuthState],
                    [oAuthCode]
                )

                if (clientRedirectUri) {
                    window.location.replace(clientRedirectUri)
                } else {
                    setMessage("You have joined the group!")
                }
            }
        })()
    }, [_searchParams, admin, isLoggedInAdmin])

    return (
        <>
            {isBlockchain && (
                <Flex justifyContent="center" align="center" mt="10">
                    <Button
                        variant="solid"
                        colorScheme="primary"
                        onClick={
                            !isLoggedInAdmin()
                                ? openConnectModal
                                : openAccountModal
                        }
                    >
                        {!isLoggedInAdmin()
                            ? "Connect Wallet"
                            : `Connected as ${shortenAddress(
                                  address as string
                              )}`}
                    </Button>
                </Flex>
            )}
            <Flex flex="1" justify="center" align="center">
                <Text>{_message}</Text>
            </Flex>
        </>
    )
}
