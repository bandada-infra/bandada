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
                const provider = searchParams.get("provider")
                const redirectURI =
                    searchParams.get("redirect_uri") || undefined

                const stateId = await setOAuthState(
                    groupId as string,
                    memberId as string,
                    provider as string,
                    redirectURI
                )

                if (stateId) {
                    switch (provider) {
                        case "github":
                            window.location.replace(
                                `https://github.com/login/oauth/authorize?client_id=${
                                    import.meta.env.VITE_GITHUB_CLIENT_ID
                                }&state=${stateId}`
                            )
                            break
                        case "twitter":
                            window.location.replace(
                                `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${
                                    import.meta.env.VITE_TWITTER_CLIENT_ID
                                }&scope=users.read%20tweet.read&redirect_uri=${
                                    import.meta.env.VITE_TWITTER_REDIRECT_URI
                                }&state=${stateId}&code_challenge=${stateId}&code_challenge_method=plain`
                            )
                            break
                        default:
                    }
                }
            }

            if (searchParams.has("code") && searchParams.has("state")) {
                const oAuthCode = searchParams.get("code") as string
                const oAuthState = searchParams.get("state") as string

                const redirectURI = await addMemberByReputation(
                    oAuthState,
                    oAuthCode
                )

                if (redirectURI) {
                    window.location.replace(redirectURI)
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
