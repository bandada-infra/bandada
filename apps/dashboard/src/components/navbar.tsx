import { shortenAddress } from "@bandada/utils"
import { Button, Container, Heading, HStack, Image } from "@chakra-ui/react"
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit"
import { useCallback, useContext } from "react"
import { useAccount } from "wagmi"
import cloudsImage from "../assets/clouds.svg"
import icon1Image from "../assets/icon1.svg"
import { AuthContext } from "../context/auth-context"

export default function NavBar(): JSX.Element {
    // const { chain } = useNetwork()
    const { address } = useAccount()
    const { openConnectModal } = useConnectModal()
    // const { openChainModal } = useChainModal()
    const { openAccountModal } = useAccountModal()
    const { admin } = useContext(AuthContext)

    // const isSupportedNetwork = useCallback(
    // () => chain && chain.id === goerli.id,
    // [chain]
    // )

    const isLoggedInAdmin = useCallback(
        () => admin && admin.address === address,
        [address, admin]
    )

    return (
        <Container maxWidth="container.xl">
            <HStack
                pt="80px"
                pb="40px"
                align="center"
                justify="space-between"
                backgroundImage={`url(${cloudsImage})`}
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="450px"
            >
                <a href="https://bandada.pse.dev">
                    <HStack spacing="1">
                        <Image
                            src={icon1Image}
                            htmlWidth="35px"
                            alt="Bandada icon"
                        />
                        <Heading fontSize="25px" as="h1">
                            bandada
                        </Heading>
                    </HStack>
                </a>
                <HStack spacing="4">
                    {
                        // <Button
                        // variant="solid"
                        // colorScheme={isSupportedNetwork() ? "secondary" : "red"}
                        // onClick={openChainModal}
                        // >
                        // {!isSupportedNetwork()
                        // ? "Unsupported network"
                        // : chain?.name}
                        // </Button>
                    }

                    <Button
                        variant="solid"
                        colorScheme="secondary"
                        onClick={
                            !isLoggedInAdmin()
                                ? openConnectModal
                                : openAccountModal
                        }
                    >
                        {!isLoggedInAdmin()
                            ? "Unconnected account"
                            : `Connected as ${shortenAddress(
                                  address as string
                              )}`}
                    </Button>
                </HStack>
            </HStack>
        </Container>
    )
}
