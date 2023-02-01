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

export default function NavBar(): JSX.Element {
    const navigate = useNavigate()
    const { disconnect, isWalletConnected, account } = useEthereumWallet()
    const { hasCopied, onCopy } = useClipboard(account || "")

    const [isSignedIn, setIsSignedIn] = useState(false)
    const [_isWalletConnected, setIsWalletConnected] = useState<boolean>()

    function logOut() {
        request(`${process.env.NX_API_URL}/auth/log-out`, {
            method: "post"
        }).catch((e) => {
            // Ignore
        })
        navigate("/sso")
        window.location.reload()
    }

    useEffect(() => {
        ;(async () => {
            // If we are on the login route, no need to check for the logged-in user
            if (window.location.toString().includes("/sso")) {
                return
            }

            // Check if wallet is connected
            if ((await isWalletConnected()) && account) {
                setIsWalletConnected(true)
                return
            }

            // Check if user logged in via SSO
            await request(`${process.env.NX_API_URL}/auth/getUser`)
                .then((res) => {
                    setIsSignedIn(true)
                })
                .catch((e) => {
                    // Redirect to login page
                    navigate("/sso")
                })
        })()
    }, [account, isWalletConnected, navigate])

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

                    {isSignedIn && (
                        <Center>
                            <Link to="/my-groups?type=off-chain">
                                <Button
                                    variant="solid"
                                    mr="10px"
                                    colorScheme="primary"
                                >
                                    My Groups
                                </Button>
                            </Link>

                            <Button variant="solid" onClick={logOut}>
                                Log out
                            </Button>
                        </Center>
                    )}

                    {_isWalletConnected && (
                        <Center>
                            <Link to="/my-groups?type=on-chain">
                                <Button
                                    variant="solid"
                                    colorScheme="primary"
                                    mr="10"
                                >
                                    My Groups
                                </Button>
                            </Link>
                            <Tooltip
                                label={hasCopied ? "Copied" : "Copy"}
                                closeOnClick={false}
                                hasArrow
                            >
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={onCopy}
                                >
                                    {account ? shortenAddress(account) : ""}
                                </Button>
                            </Tooltip>
                            <Button
                                variant="outline"
                                colorScheme="primary"
                                onClick={() => {
                                    setIsWalletConnected(false)
                                    disconnect()
                                    navigate("/sso")
                                    window.location.reload()
                                }}
                            >
                                Disconnect
                            </Button>
                        </Center>
                    )}
                </Flex>
            </Container>
        </Box>
    )
}
