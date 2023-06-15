import { Flex, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { addMemberByReputation, setOAuthState } from "../api/bandadaAPI"

export default function ReputationPage() {
    const [searchParams] = useSearchParams()

    // Step 1
    useEffect(() => {
        ;(async () => {
            if (searchParams.has("group") && searchParams.has("member")) {
                const groupId = searchParams.get("group")
                const memberId = searchParams.get("member")
                const redirectURI =
                    searchParams.get("redirect_uri") || undefined

                const stateId = await setOAuthState(
                    groupId as string,
                    memberId as string,
                    "github",
                    redirectURI
                )

                window.location.replace(
                    `https://github.com/login/oauth/authorize?client_id=${
                        import.meta.env.VITE_GITHUB_CLIENT_ID
                    }&state=${stateId}`
                )
            }
        })()
    }, [searchParams])

    // Step 2
    useEffect(() => {
        ;(async () => {
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
