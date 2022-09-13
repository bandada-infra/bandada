import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Spacer,
    Text
} from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { Cookies } from "react-cookie"

export default function NavBar(): JSX.Element {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const userSession = cookies.get("jwt")
    function logOut() {
        cookies.remove("jwt")
        navigate("/")
        window.location.reload()
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
