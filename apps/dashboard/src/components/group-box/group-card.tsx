import { Container, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Group } from "src/types/groups"

export default function GroupCard(group: Group): JSX.Element {
    return (
        <Container p="20px">
            <Heading fontSize="2xl">{group.name}</Heading>
            <Text mt="10px">{group.members.length}members</Text>
            <Text mt="30px" mb="28px">
                {group.description}
            </Text>
            <Link to={`/manage?group=${group.name}`}>
                <Text fontWeight="bold" color="#5867BC">
                    Manage
                </Text>
            </Link>
        </Container>
    )
}
