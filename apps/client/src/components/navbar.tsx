import React, { useEffect } from "react"
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Spacer,
    Text,
    Tooltip
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { providers, utils } from "ethers"

const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
})

export default function NavBar(): JSX.Element {
    const { activate, account } = useWeb3React<providers.Web3Provider>()
    const copyAccount = async () => {
        account && (await navigator.clipboard.writeText(account))
    }

    useEffect(() => {
        ;(async () => {
            if (await injectedConnector.isAuthorized()) {
                await activate(injectedConnector)
            }
        })()
    }, [activate])

    function shortenAddress(address: string, chars = 4): string {
        address = utils.getAddress(address)

        return `${address.substring(0, chars + 2)}...${address.substring(
            42 - chars
        )}`
    }

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
                    <Center>
                        {account ? (
                            <Tooltip label="copy">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={copyAccount}
                                    sx={{ marginRight: 10 }}
                                >
                                    {shortenAddress(account)}
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button
                                mr="10px"
                                onClick={() => activate(injectedConnector)}
                            >
                                Connect wallet
                            </Button>
                        )}
                    </Center>
                </Flex>
            </Container>
        </Box>
    )
}
