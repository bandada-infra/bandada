import { Button, Center, Flex, Spacer, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export default function NavBar(): JSX.Element {
    return (
        <Flex h="100px" borderBottom="1px" borderColor="gray.200">
            <Center ml="30px">
                <Link to="/">
                    <Text fontSize="lg" fontWeight="bold">
                        ZK Groups
                    </Text>
                </Link>
            </Center>

            <Spacer />

            <Center mr="50px">
                <Link to="/login">
                    <Button mr="20px">Log in</Button>
                </Link>
                <Link to="/join">
                    <Button>Join</Button>
                </Link>
            </Center>
        </Flex>
    )
}
