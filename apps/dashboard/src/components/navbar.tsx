import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Spacer,
    Text,
    Tooltip,
    useClipboard
} from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { Cookies } from "react-cookie"
import { useEffect, useState } from "react"
import useEthereumWallet from "../hooks/useEthereumWallet"
import { shortenAddress } from "@zk-groups/utils"

export default function NavBar(): JSX.Element {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const userSession = cookies.get("jwt")
    const { disconnect, isWalletConnected, account } = useEthereumWallet()
    const { hasCopied, onCopy } = useClipboard(account || "")
    const [_isWalletConnected, setIsWalletConnected] = useState<boolean>()
    const [_account, setAccount] = useState<string>()

    function logOut() {
        cookies.remove("jwt")
        navigate("/")
        window.location.reload()
    }

    useEffect(() => {
        ;(async () => {
            const isConnected = await isWalletConnected()
            if (isConnected && account) {
                setIsWalletConnected(isConnected)
                setAccount(account)
            }
        })()
    }, [isWalletConnected, account])

    return (
        <Box bgColor="#F8F9FF" borderBottom="1px" borderColor="gray.200">
            <Container maxWidth="container.xl">
                <Flex h="100px">
                    <Center>
                        <Link to="/">
                            <Text fontSize="lg" fontWeight="bold">
                                ZK Groups
                            </Text>
                        </Link>
                    </Center>

                    <Spacer />
                    {userSession ? (
                        <Center>
                            <Button variant="solid" mr="10px" onClick={logOut}>
                                Log out
                            </Button>
                            <Link to="/my-groups">
                                <Button variant="solid" colorScheme="primary">
                                    My Groups
                                </Button>
                            </Link>
                        </Center>
                    ) : _isWalletConnected ? (
                        <Center>
                            <Tooltip
                                label={hasCopied ? "Copied" : "Copy"}
                                closeOnClick={false}
                                hasArrow
                            >
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={onCopy}
                                    sx={{ marginRight: 10 }}
                                >
                                    {_account ? shortenAddress(_account) : ""}
                                </Button>
                            </Tooltip>
                            <Button
                                variant="solid"
                                colorScheme="primary"
                                onClick={() => {
                                    disconnect()
                                    navigate("/sso")
                                    window.location.reload()
                                }}
                            >
                                Disconnect
                            </Button>
                        </Center>
                    ) : (
                        <Center>
                            <Link to="/sso?opt=login">
                                <Button mr="10px" variant="solid">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/sso?opt=get-started">
                                <Button variant="solid" colorScheme="primary">
                                    Get started
                                </Button>
                            </Link>
                        </Center>
                    )}
                </Flex>
            </Container>
        </Box>
    )
}
