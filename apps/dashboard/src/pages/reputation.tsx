import { getProvider } from "@bandada/reputation"
import { Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { addMemberByReputation, setOAuthState } from "../api/bandadaAPI"

export default function ReputationPage() {
    const [_searchParams] = useSearchParams()
    const [_message, setMessage] = useState<string>(
        "Joining reputation group..."
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

                if (state) {
                    const clientId = import.meta.env[
                        `VITE_${providerName?.toUpperCase()}_CLIENT_ID`
                    ]
                    const redirectUri = import.meta.env[
                        `VITE_${providerName?.toUpperCase()}_REDIRECT_URI`
                    ]

                    const provider = getProvider(providerName as string)

                    const authUrl = provider.getAuthUrl(
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

                const clientRedirectUri = await addMemberByReputation(
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
    }, [_searchParams])

    return (
        <Flex flex="1" justify="center" align="center">
            <Text>{_message}</Text>
        </Flex>
    )
}
