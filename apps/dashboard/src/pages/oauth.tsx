import { Flex, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { addMember, getOAuthState } from "../api/bandadaAPI"

export default function OAuthPage() {
    const [searchParams] = useSearchParams()

    // Step 1
    useEffect(() => {
        ;(async () => {
            if (searchParams.has("group") && searchParams.has("member")) {
                const groupId = searchParams.get("group")
                const memberId = searchParams.get("member")

                const stateId = await getOAuthState(
                    groupId as string,
                    memberId as string,
                    "github"
                )

                window.location.replace(
                    `https://github.com/login/oauth/authorize?client_id=${
                        import.meta.env.VITE_GITHUB_CLIENT_ID
                    }&state=${stateId}_${groupId}_${memberId}`
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

                const [oAuthStateId, groupId, memberId] = oAuthState.split("_")

                await addMember(groupId, memberId, oAuthCode, oAuthStateId)
            }
        })()
    }, [searchParams])

    return (
        <Flex flex="1" justify="center" align="center">
            <Text>Joining reputation group...</Text>
        </Flex>
    )
}
