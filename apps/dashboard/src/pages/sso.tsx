import {
    Box,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Heading,
    Icon,
    Image,
    Text,
    VStack
} from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect } from "react"
import { FaEthereum } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { goerli, useAccount, useSwitchNetwork } from "wagmi"
import logoUrl from "../assets/logo.svg"
import SsoButton from "../components/sso-button"

export default function SSO(): JSX.Element {
    const navigate = useNavigate()
    const { openConnectModal } = useConnectModal()
    const { switchNetwork } = useSwitchNetwork()
    const { pathname } = useLocation()

    const { isConnected } = useAccount()

    useEffect(() => {
        if (isConnected) {
            switchNetwork?.(goerli.id)

            navigate("/my-groups?type=on-chain")
        }
    }, [navigate, isConnected, switchNetwork])

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
                            <br /> ZK group
                        </span>
                    )}
                </Heading>
            </VStack>

            <Flex
                flexDir="column"
                justifyContent="space-between"
                alignItems="center"
            >
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
                <Divider orientation="horizontal" my="24px" w="500px" />
                <Text mb="24px">Continue off-chain</Text>
                <SsoButton provider="Github" />
                <SsoButton provider="Twitter" />
                <SsoButton provider="Reddit" />
            </Flex>
        </Container>
    )
}
