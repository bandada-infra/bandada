import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Image,
    Link,
    Text,
    VStack
} from "@chakra-ui/react"
import { useLocation, useOutlet } from "react-router-dom"
import logoUrl from "../assets/logo.svg"
import Footbar from "../components/footbar"
import NavBar from "../components/navbar"

export default function Home(): JSX.Element {
    const outlet = useOutlet()
    const { pathname } = useLocation()

    return (
        <>
            {!["/", "/login", "/sign-up"].includes(pathname) && <NavBar />}

            <Box flex="1">
                {outlet || (
                    <Container maxW="container.xl" pt="20" pb="20" px="6">
                        <HStack spacing="16" align="start">
                            <VStack spacing="8" align="left" flexBasis="400px">
                                <Image
                                    src={logoUrl}
                                    htmlWidth="200px"
                                    pb="10"
                                    alt="Bandada logo"
                                />

                                <Heading as="h2" size="2xl">
                                    There’s power
                                    <br /> in groups
                                </Heading>
                                <Text fontSize="lg">
                                    Easily manage privacy-preserving groups of
                                    anonymous individuals with our open-source
                                    system.
                                </Text>

                                <VStack spacing="3" align="left">
                                    <Link href="/sign-up">
                                        <Button
                                            colorScheme="primary"
                                            variant="solid"
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button
                                            colorScheme="primary"
                                            variant="outline"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                </VStack>
                            </VStack>
                            <Box bg="#C2C2C2" height="600px" flex="1" />
                        </HStack>
                    </Container>
                )}
            </Box>

            <Footbar />
        </>
    )
}
