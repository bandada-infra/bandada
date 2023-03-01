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
import { useCallback, useEffect, useState } from "react"
import { request, shortenAddress } from "@zk-groups/utils"
import { useAccount, useDisconnect } from "wagmi"

export default function NavBar(): JSX.Element {
    const navigate = useNavigate()
    const { isConnected, address } = useAccount()
    const { hasCopied, onCopy } = useClipboard(address || "")
    const [isSignedIn, setIsSignedIn] = useState(false)

    const { disconnect } = useDisconnect({
        onSuccess: () => {
            navigate("/sso")
            window.location.reload()
        }
    })

    const logOut = useCallback(() => {
        request(`${import.meta.env.VITE_API_URL}/auth/log-out`, {
            method: "post"
        }).finally(() => {
            navigate("/sso")
            window.location.reload()
        })
    }, [navigate])

    useEffect(() => {
        ;(async () => {
            // If we are on the login route, no need to check for the logged-in user
            if (["/sso", "/"].includes(window.location.pathname)) {
                return
            }

            // No need to get logged in user if wallet is already connected (on-chain mode)
            if (isConnected) {
                return
            }

            // Check if user logged in via SSO
            await request(`${import.meta.env.VITE_API_URL}/auth/getUser`)
                .then(() => {
                    setIsSignedIn(true)
                })
                .catch(() => {
                    // Redirect to login page
                    navigate("/sso")
                })
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                    {isConnected && (
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
                                    {address ? shortenAddress(address) : ""}
                                </Button>
                            </Tooltip>
                            <Button
                                variant="outline"
                                colorScheme="primary"
                                onClick={() => disconnect()}
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
