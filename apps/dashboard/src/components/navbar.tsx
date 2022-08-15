import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Spacer,
    Text
} from "@chakra-ui/react"
import { Link } from "react-router-dom"

export default function NavBar(): JSX.Element {
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
                        <Link to="/sso?opt=login">
                            <Button mr="10px" variant="solid">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/sso?opt=get-started">
                            <Button
                                variant="solid"
                                colorScheme="primary"
                            >
                                Get started
                            </Button>
                        </Link>
                    </Center>
                </Flex>
            </Container>
        </Box>
    )
}
