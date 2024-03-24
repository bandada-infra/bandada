import {
    getProvider,
    blockchain,
    Web2Provider,
    twitter,
    github
} from "@bandada/credentials"
import { Flex, Text, Button } from "@chakra-ui/react"
import { useEffect, useState, useCallback, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { shortenAddress } from "@bandada/utils"
import { addMemberByCredentials, setOAuthState } from "../api/bandadaAPI"
import { AuthContext } from "../context/auth-context"

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
        ;(async () => {
            if (_searchParams.has("group") && _searchParams.has("member")) {
                const groupId = _searchParams.get("group")
                const memberId = _searchParams.get("member")
                const providerName = _searchParams.get("provider")
                const clientRedirectUri =
                    _searchParams.get("redirect_uri") || undefined

                const state = await setOAuthState(
                    groupId as string,
                    memberId as string,
                    providerName as string,
                    clientRedirectUri
                )

                setIsBlockchain(providerName === blockchain.name)

                if (
                    providerName === blockchain.name &&
                    isLoggedInAdmin() &&
                    state
                ) {
                    if (state && admin) {
                        const redirectUrl = await addMemberByCredentials(
                            state,
                            undefined,
                            admin.address
                        )

                        if (redirectUrl) {
                            window.location.replace(redirectUrl)
                        } else {
                            setMessage("You have joined the group!")
                        }
                    }
                }

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

            if (_searchParams.has("code") && _searchParams.has("state")) {
                const oAuthCode = _searchParams.get("code") as string
                const oAuthState = _searchParams.get("state") as string

                const clientRedirectUri = await addMemberByCredentials(
                    oAuthState,
                    oAuthCode
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
