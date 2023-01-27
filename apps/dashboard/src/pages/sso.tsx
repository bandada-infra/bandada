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
import { useSearchParams } from "react-router-dom"
import SsoButton from "../components/sso-button"
import { FaEthereum } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import useEthereumWallet from "../hooks/useEthereumWallet"

export default function SSO(): JSX.Element {
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("opt")
    const navigate = useNavigate()
    const { connectWallet, account } = useEthereumWallet()

    useEffect(() => {
        if (account) {
            navigate("/my-groups?type=on-chain")
        }
    }, [account, navigate])

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
                        onClick={() => {
                            connectWallet()
                        }}
                    >
                        <Icon as={FaEthereum} mr="13px" />
                        Connect MetaMask
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
