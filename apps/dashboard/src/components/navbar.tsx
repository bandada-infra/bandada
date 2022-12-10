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
import { useEffect, useState } from "react"
import useEthereumWallet from "../hooks/useEthereumWallet"
import { request, shortenAddress } from "@zk-groups/utils"
import { environment } from "../environments/environment"

export default function NavBar(): JSX.Element {
    const navigate = useNavigate()
    const [jwtInCookies, setJwtInCookies] = useState(false)
    const { disconnect, isWalletConnected, account } = useEthereumWallet()
    const { hasCopied, onCopy } = useClipboard(account || "")
    const [_isWalletConnected, setIsWalletConnected] = useState<boolean>()
    const [_account, setAccount] = useState<string>()

    function logOut() {
        request(`${environment.apiUrl}/auth/log-out`, { method: "post" }).catch(
            (e) => {
                console.log("no jwt")
            }
        )
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

    useEffect(() => {
        ;(async () => {
            await request(`${environment.apiUrl}/auth/getUser`)
                .then((res) => {
                    setJwtInCookies(true)
                })
                .catch((e) => {
                    console.log("no jwt")
                    setJwtInCookies(false)
                })
        })()
    }, [])

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
                    {jwtInCookies ? (
                        <Center>
                            <Button variant="solid" mr="10px" onClick={logOut}>
                                Log out
                            </Button>
                            <Link to="/my-groups?type=off-chain">
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
