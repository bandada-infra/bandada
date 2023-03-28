import { CONTRACT_ADDRESSES } from "@bandada/utils"
import { Container, HStack, Icon, IconButton, Link } from "@chakra-ui/react"
import { FaEthereum, FaGithub } from "react-icons/fa"

export default function Footbar(): JSX.Element {
    return (
        <Container maxWidth="container.xl" py="15" mt="20px">
            <HStack align="center" justify="right" p="2">
                <Link
                    href={`https://goerli.etherscan.io/address/${CONTRACT_ADDRESSES.goerli.Bandada}`}
                    isExternal
                >
                    <IconButton
                        variant="unstyled"
                        aria-label="Bandada contract"
                        icon={<Icon boxSize={6} as={FaEthereum} />}
                    />
                </Link>
                <Link
                    href="https://github.com/privacy-scaling-explorations/bandada"
                    isExternal
                >
                    <IconButton
                        variant="unstyled"
                        aria-label="Github repository"
                        icon={<Icon boxSize={6} as={FaGithub} />}
                    />
                </Link>
            </HStack>
        </Container>
    )
}
