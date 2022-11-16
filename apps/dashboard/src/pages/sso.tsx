import { Center, Container, Flex, Heading } from "@chakra-ui/react"
import { useSearchParams } from "react-router-dom"
import SsoButton from "../components/sso-button"

export default function SSO(): JSX.Element {
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("opt")
    return (
        <Container maxW="500px">
            <Center mt="80px" mb="50px">
                <Heading fontSize="56px" textAlign="center">
                    {pageOption === "get-started"
                        ? "Create your first zk group"
                        : "Welcome back"}
                </Heading>
            </Center>
            <Flex
                height="200px"
                flexDir="column"
                justifyContent="space-between"
            >
                <SsoButton provider="Github" />
                <SsoButton provider="Twitter" />
                <SsoButton provider="Reddit" />
            </Flex>
        </Container>
    )
}
