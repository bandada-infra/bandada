import { Button, Center, Container, Heading } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export default function PermissionGroup(): JSX.Element {
    const { groupName } = useParams()
    const { invitationCode } = useParams()
    const [isValid, setIsValid] = useState<boolean>(false)

    useEffect(() => {
        ;(async () => {
            if (invitationCode === "validCode") {
                setIsValid(true)
            }
        })()
    }, [invitationCode])

    return (
        <Container flex="1" mb="80px" mt="300px" px="80px" maxW="container.lg">
            {isValid ? (
                <Center flexDirection="column">
                    <Heading textAlign="center" as="h2" size="xl">
                        You are invited to {groupName} group
                    </Heading>
                    <Button>Join Group</Button>
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
