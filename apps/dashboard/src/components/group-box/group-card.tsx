import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react"
import { Group } from "src/types/groups"

export default function GroupCard(group: Group): JSX.Element {
    return (
        <Container p="20px">
            <Heading fontSize="2xl">{group.name}</Heading>
            <Text mt="10px">{group.members}members</Text>
            <Text mt="30px">{group.description}</Text>
            <Button mt="28px">Manage</Button>
        </Container>
    )
}
