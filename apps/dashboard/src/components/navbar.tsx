import { Button, Center, Flex, Spacer, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export default function NavBar(): JSX.Element {
    return (
        <Flex
            h="100px"
            bgColor="#F8F9FF"
            borderBottom="1px"
            borderColor="gray.200"
        >
            <Center ml="30px">
                <Link to="/">
                    <Text fontSize="lg" fontWeight="bold">
                        ZK Groups
                    </Text>
                </Link>
            </Center>

            <Spacer />

            <Center mr="50px">
                <Link to="/sso?opt=login">
                    <Button mr="10px" bgColor="rgba(0,0,0,0)">
                        Log in
                    </Button>
                </Link>
                <Link to="/sso?opt=get-started">
                    <Button
                        bgColor="gray.800"
                        color="#FAFBFC"
                        _hover={{ bg: "gray.600" }}
                    >
                        Get started
                    </Button>
                </Link>
            </Center>
        </Flex>
    )
}
