import {
    Box,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Heading,
    Icon,
    Text
} from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect } from "react"
import { FaEthereum } from "react-icons/fa"
import { useNavigate, useSearchParams } from "react-router-dom"
import { goerli, useAccount, useSwitchNetwork } from "wagmi"
import SsoButton from "../components/sso-button"

export default function SSO(): JSX.Element {
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("opt")
    const navigate = useNavigate()
    const { openConnectModal } = useConnectModal()
    const { switchNetwork } = useSwitchNetwork()

    const { isConnected } = useAccount()

    useEffect(() => {
        if (isConnected) {
            switchNetwork?.(goerli.id)
            navigate("/my-groups?type=on-chain")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, isConnected])

    return (
        <Container maxW="500px">
            <Center mt="80px" mb="50px">
                <Heading fontSize="56px" textAlign="center">
                    {pageOption === "get-started"
                        ? "Create your first zk group"
                        : "Welcome back"}
                </Heading>
            </Center>
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
