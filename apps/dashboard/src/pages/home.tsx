import {
    Box,
    Button,
    Container,
    HStack,
    Image,
    Text,
    VStack
} from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useLocation, useOutlet } from "react-router-dom"
import icon1Image from "../assets/icon1.svg"
import jumbotronImage from "../assets/jumbotron.svg"
import Footbar from "../components/footbar"
import NavBar from "../components/navbar"

export default function HomePage(): JSX.Element {
    const outlet = useOutlet()
    const { openConnectModal } = useConnectModal()
    const { pathname } = useLocation()

    return (
        <VStack
            bgColor={pathname === "/" ? "balticSea.950" : "inherit"}
            bgGradient={
                pathname !== "/"
                    ? "linear(to-b, classicRose.200, balticSea.100)"
                    : "inherit"
            }
            color={pathname === "/" ? "balticSea.50" : "inherit"}
            flex="1"
        >
            {pathname !== "/" && <NavBar />}

            <Box flex="1" width="100%">
                {outlet || (
                    <Container
                        maxW="container.xl"
                        pt="20"
                        pb="20"
                        px="6"
                        centerContent
                    >
                        <VStack spacing="5" pb="100px">
                            <HStack mb="50px" spacing="1">
                                <Image
                                    src={icon1Image}
                                    htmlWidth="32px"
                                    alt="Bandada icon"
                                />
                                <Text fontSize="22px">bandada</Text>
                            </HStack>

                            <Text
                                fontSize="16px"
                                fontWeight="500"
                                color="sunsetOrange.100"
                                fontFamily="DM Sans, sans-serif"
                                textTransform="uppercase"
                            >
                                birds of a feather band together
                            </Text>

                            <Text fontSize="6xl" lineHeight="67px">
                                Anonymous groups
                                <br /> for your web3 apps.
                            </Text>

                            <Button
                                onClick={openConnectModal}
                                colorScheme="primary"
                                variant="solid"
                            >
                                Sign in with Ethereum
                            </Button>

                            <Button
                                variant="link"
                                color="balticSea.200"
                                textDecoration="underline"
                            >
                                I don&apos;t have a wallet
                            </Button>
                        </VStack>

                        <Image src={jumbotronImage} htmlWidth="728px" />
                    </Container>
                )}
            </Box>

            <Footbar />
        </VStack>
    )
}
