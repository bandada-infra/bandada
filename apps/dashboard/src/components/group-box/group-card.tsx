import { Container, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Group } from "src/types/groups"

export default function GroupCard(group: Group): JSX.Element {
    return (
        <Container p="20px" maxW="276">
            <Heading fontSize="2xl">{group.name}</Heading>
            <Text mt="10px" color="gray.500">
                {group.members.length} members
            </Text>
            <Text mt="30px" mb="28px" color="gray.500">
                {group.description}
            </Text>
            <Link to={`/my-groups/${group.name}`}>
                <Text fontWeight="bold" color="#5867BC">
                    Manage
                </Text>
            </Link>
        </Container>
    )
}
