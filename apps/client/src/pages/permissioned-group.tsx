import { Button, Center, Container, Heading } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import usePermissionedGroups from "src/hooks/usePermissionedGroups"

export default function PermissionedGroup(): JSX.Element {
    const { inviteCode } = useParams()
    const [_groupName, setGroupName] = useState<string>()
    const [_isRedeemed, setIsRedeemed] = useState<boolean>()
    const { validateCode, generateIdentityCommitment, addMember, hasjoined } =
        usePermissionedGroups()
    useEffect(() => {
        ;(async () => {
            const codeInfo = await validateCode(inviteCode)
            if (codeInfo) {
                setGroupName(await codeInfo.groupName)
                setIsRedeemed(await codeInfo.redeemed)
            }
        })()
    }, [inviteCode, validateCode])

    async function joinGroup() {
        try {
            const identityCommitment =
                _groupName && (await generateIdentityCommitment(_groupName))
            if (hasjoined) {
                alert("You have already joined")
                return
            }
            if (_groupName && identityCommitment && inviteCode) {
                addMember(_groupName, identityCommitment, inviteCode)
                return
            }
        } catch (e) {
            console.error(e)
        }
        console.log("join group")
    }

    return (
        <Container flex="1" mb="80px" mt="300px" px="80px" maxW="container.lg">
            {_isRedeemed === false ? (
                <Center flexDirection="column">
                    <Heading textAlign="center" as="h2" size="xl">
                        You are invited to {_groupName} group
                    </Heading>
                    <Button onClick={() => joinGroup()}>Join Group</Button>
                </Center>
            ) : (
                <Center>
                    <Heading textAlign="center" as="h2" size="xl">
                        This link is expired or invalid.
                    </Heading>
                </Center>
            )}
        </Container>
    )
}
