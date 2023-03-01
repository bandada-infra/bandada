import {
    Button,
    Container,
    Heading,
    Link,
    Text,
    VStack
} from "@chakra-ui/react"
import { useOutlet } from "react-router-dom"
import NavBar from "../components/navbar"

export default function Home(): JSX.Element {
    const outlet = useOutlet()

    return (
        <>
            <NavBar />

            {outlet || (
                <Container maxW="2xl" pt="180px" pb="80px" centerContent>
                    <VStack spacing="8">
                        <Heading as="h2" size="2xl" textAlign="center">
                            Welcome to ZKGroups
                        </Heading>
                        <Text fontSize="xl">
                            A system for managing privacy-preserving groups.
                        </Text>

                        <Link href="/sso">
                            <Button colorScheme="primary" variant="solid">
                                Launch app
                            </Button>
                        </Link>
                    </VStack>
                </Container>
            )}
        </>
    )
}
