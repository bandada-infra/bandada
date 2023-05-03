import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Image,
    Text,
    VStack
} from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { FaEthereum } from "react-icons/fa"
import { useLocation } from "react-router-dom"
import logoUrl from "../assets/logo.svg"

export default function SIWE(): JSX.Element {
    const { openConnectModal } = useConnectModal()
    const { pathname } = useLocation()

    return (
        <Container maxW="container.xl" pt="20" pb="20" px="6">
            <VStack pb="16" spacing="8">
                <Image src={logoUrl} htmlWidth="200px" alt="Bandada logo" />

                <Heading fontSize="56px" textAlign="center">
                    {pathname === "/login" ? (
                        <span>Welcome back</span>
                    ) : (
                        <span>
                            Create your first
                            <br /> Bandada group
                        </span>
                    )}
                </Heading>
            </VStack>

            <Flex
                flexDir="column"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading mb="2rem">Sign in with Ethereum</Heading>

                <Text mb="24px">Continue on the Ethereum blockchain</Text>
                <Box>
                    <Button
                        h="44px"
                        bgColor="#FFFFFF"
                        border="1px solid #D0D1D2"
                        fontSize="18px"
                        w="500px"
                        onClick={openConnectModal}
                    >
                        <Icon as={FaEthereum} mr="13px" />
                        Connect Wallet
                    </Button>
                </Box>
            </Flex>
        </Container>
    )
}
