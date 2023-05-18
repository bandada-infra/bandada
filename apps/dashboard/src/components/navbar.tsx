import { shortenAddress } from "@bandada/utils"
import { Button, Container, HStack, Image, Link } from "@chakra-ui/react"
import {
    useAccountModal,
    useChainModal,
    useConnectModal
} from "@rainbow-me/rainbowkit"
import { useCallback, useContext, useEffect } from "react"
import { useAccount, useNetwork } from "wagmi"
import { goerli } from "wagmi/chains"
import logoImage from "../assets/logo.svg"
import { AuthContext } from "../context/authContext"

export default function NavBar(): JSX.Element {
    const { chain } = useNetwork()
    const { address } = useAccount()
    const { openConnectModal } = useConnectModal()
    const { openChainModal } = useChainModal()
    const { openAccountModal } = useAccountModal()
    const { admin } = useContext(AuthContext)

    const isSupportedNetwork = useCallback(
        () => chain && chain.id === goerli.id,
        [chain]
    )

    const isLoggedInAdmin = useCallback(
        () => admin?.address === address,
        [address, admin]
    )

    useEffect(() => {
        if (admin && !isLoggedInAdmin()) {
            openConnectModal?.()
        }
    }, [isLoggedInAdmin, openConnectModal, admin])

    return (
        <Container maxWidth="container.xl">
            <HStack h="150px" align="center" justify="space-between">
                <Link href="/">
                    <Image
                        src={logoImage}
                        htmlWidth="160px"
                        alt="Bandada logo"
                    />
                </Link>

                <HStack spacing="4">
                    <Button
                        variant="outline"
                        colorScheme={isSupportedNetwork() ? "primary" : "red"}
                        onClick={openChainModal}
                    >
                        {!isSupportedNetwork()
                            ? "Unsupported network"
                            : chain?.name}
                    </Button>

                    <Button
                        variant="outline"
                        colorScheme={isLoggedInAdmin() ? "primary" : "red"}
                        onClick={openAccountModal}
                    >
                        {!isLoggedInAdmin()
                            ? "Unconnected account"
                            : shortenAddress(address as string)}
                    </Button>
                </HStack>
            </HStack>
        </Container>
    )
}
