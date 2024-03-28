import { CONTRACT_ADDRESSES } from "@bandada/utils"
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Icon,
    Image,
    Link,
    Text,
    VStack
} from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { FiGithub } from "react-icons/fi"
import { LiaEthereum } from "react-icons/lia"
import { useLocation, useOutlet } from "react-router-dom"
import icon1Image from "../assets/icon1.svg"
import jumbotronImage from "../assets/jumbotron.svg"
import NavBar from "../components/navbar"

export default function HomePage(): JSX.Element {
    const outlet = useOutlet()
    const { openConnectModal } = useConnectModal()
    const { pathname } = useLocation()

    return (
        <VStack
            bgColor={pathname === "/" ? "balticSea.950" : "classicRose.200"}
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
                        px="8"
                        centerContent
                    >
                        <VStack spacing="5" pb="30px">
                            <HStack mb="60px" justify="space-between" w="100%">
                                <HStack spacing="1">
                                    <Image
                                        src={icon1Image}
                                        htmlWidth="32px"
                                        alt="Bandada icon"
                                    />
                                    <Heading fontSize="22px" as="h1">
                                        bandada
                                    </Heading>
                                </HStack>

                                <HStack spacing="5">
                                    <Link
                                        href="https://github.com/bandada-infra/bandada"
                                        isExternal
                                    >
                                        <HStack spacing="1">
                                            <Icon
                                                boxSize={5}
                                                color="balticSea.500"
                                                as={FiGithub}
                                            />
                                            <Text
                                                color="balticSea.300"
                                                textDecoration="underline"
                                            >
                                                Github
                                            </Text>
                                        </HStack>
                                    </Link>
                                    <Link
                                        href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.sepolia.Bandada}`}
                                        isExternal
                                    >
                                        <HStack spacing="1">
                                            <Icon
                                                boxSize={6}
                                                color="balticSea.500"
                                                as={LiaEthereum}
                                            />
                                            <Text
                                                color="balticSea.300"
                                                textDecoration="underline"
                                            >
                                                Ethereum
                                            </Text>
                                        </HStack>
                                    </Link>
                                </HStack>
                            </HStack>

                            <Text
                                fontSize="16px"
                                fontWeight="500"
                                color="sunsetOrange.100"
                                textTransform="uppercase"
                            >
                                birds of a feather band together
                            </Text>

                            <Heading fontSize="61px" as="h1" lineHeight="67px">
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

                            <Link
                                href="https://ethereum.org/en/wallets/"
                                target="_blank"
                            >
                                <Button
                                    variant="link"
                                    color="balticSea.200"
                                    textDecoration="underline"
                                >
                                    I don&apos;t have a wallet
                                </Button>
                            </Link>
                        </VStack>

                        <Image
                            src={jumbotronImage}
                            htmlWidth="728px"
                            borderRadius="8px"
                        />
                    </Container>
                )}
            </Box>
        </VStack>
    )
}
