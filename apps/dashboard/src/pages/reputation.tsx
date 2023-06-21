import { getProvider } from "@bandada/reputation"
import { Flex, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { addMemberByReputation, setOAuthState } from "../api/bandadaAPI"

export default function ReputationPage() {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        ;(async () => {
            if (searchParams.has("group") && searchParams.has("member")) {
                const groupId = searchParams.get("group")
                const memberId = searchParams.get("member")
                const providerName = searchParams.get("provider")
                const clientRedirectUri =
                    searchParams.get("redirect_uri") || undefined

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
                        `VITE_${clientRedirectUri?.toUpperCase()}_REDIRECT_URI`
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

            if (searchParams.has("code") && searchParams.has("state")) {
                const oAuthCode = searchParams.get("code") as string
                const oAuthState = searchParams.get("state") as string

                const redirectUri = await addMemberByReputation(
                    oAuthState,
                    oAuthCode
                )

                if (redirectUri) {
                    window.location.replace(redirectUri)
                }
            }
        })()
    }, [searchParams])

    return (
        <Flex flex="1" justify="center" align="center">
            <Text>Joining reputation group...</Text>
        </Flex>
    )
}
