import { Container, Heading, Icon } from "@chakra-ui/react"
import { FaSadTear } from "react-icons/fa"

export default function NotFoundPage(): JSX.Element {
    return (
        <Container flex="1" mb="80px" mt="300px" px="80px" maxW="container.lg">
            <Heading textAlign="center" as="h2" size="xl">
                404 Not Found <Icon boxSize="35px" as={FaSadTear} />
            </Heading>
        </Container>
    )
}
