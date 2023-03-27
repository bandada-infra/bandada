import { shortenAddress } from "@bandada/utils"
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Link,
    Spacer,
    Text,
    Tooltip,
    useClipboard
} from "@chakra-ui/react"
import { useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAccount } from "wagmi"
import { logOut as _logOut } from "../api/bandadaAPI"

export default function NavBar(): JSX.Element {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { address } = useAccount()
    const { hasCopied, onCopy } = useClipboard(address || "")

    const logOut = useCallback(async () => {
        await _logOut()

        navigate("/")
    }, [navigate])

    return (
        <Box bgColor="#F8F9FF" borderBottom="1px" borderColor="gray.200">
            <Container maxWidth="container.xl">
                <Flex h="100px">
                    <Center>
                        <Link href="/">
                            <Text fontSize="lg" fontWeight="bold">
                                Bandada
                            </Text>
                        </Link>
                    </Center>

                    <Spacer />

                    {!searchParams.has("on-chain") ? (
                        <Center>
                            <Button variant="solid" onClick={logOut}>
                                Log out
                            </Button>
                        </Center>
                    ) : (
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
                                >
                                    {address ? shortenAddress(address) : ""}
                                </Button>
                            </Tooltip>
                            <Button
                                variant="outline"
                                colorScheme="primary"
                                onClick={() => navigate("/")}
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
