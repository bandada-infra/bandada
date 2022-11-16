import { Container, Heading } from "@chakra-ui/react"
export default function Home(): JSX.Element {
    return (
        <Container
            textAlign="center"
            flex="1"
            mb="80px"
            mt="300px"
            px="80px"
            maxW="container.lg"
        >
            <Heading fontSize="150px">Client App</Heading>
        </Container>
    )
}
