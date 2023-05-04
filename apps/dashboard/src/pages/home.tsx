import {
    Box,
    Button,
    Container,
    Heading,
    Image,
    Text,
    VStack
} from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useLocation, useOutlet } from "react-router-dom"
import jumbotronImage from "../assets/jumbotron.svg"
import logoImage from "../assets/logo.svg"
import Footbar from "../components/footbar"
import NavBar from "../components/navbar"

export default function Home(): JSX.Element {
    const outlet = useOutlet()
    const { openConnectModal } = useConnectModal()
    const { pathname } = useLocation()

    return (
        <>
            {!["/", "/login", "/sign-up"].includes(pathname) && <NavBar />}

            <Box flex="1">
                {outlet || (
                    <Container
                        maxW="container.xl"
                        pt="20"
                        pb="20"
                        px="6"
                        centerContent
                    >
                        <VStack spacing="5" pb="14">
                            <Image
                                src={logoImage}
                                htmlWidth="200px"
                                pb="10"
                                alt="Bandada logo"
                            />

                            <Text
                                fontSize="sm"
                                textTransform="uppercase"
                                color="background.700"
                            >
                                birds of a feather band together
                            </Text>

                            <Heading as="h2" size="2xl">
                                Anonymous groups
                                <br /> for your web3 apps.
                            </Heading>

                            <Button
                                onClick={openConnectModal}
                                colorScheme="primary"
                                variant="solid"
                            >
                                Sign in with Ethereum
                            </Button>
                        </VStack>

                        <Image src={jumbotronImage} htmlWidth="600px" />
                    </Container>
                )}
            </Box>

            <Footbar />
        </>
    )
}
