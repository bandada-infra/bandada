import { Container, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Group } from "../../types/groups"

export default function GroupCard({
    name,
    type,
    description,
    members,
    id
}: Group): JSX.Element {
    return (
        <Container p="20px" maxW="276">
            <Heading fontSize="2xl">{name}</Heading>

            <Text mt="10px" color="gray.500">
                {members.length} members
            </Text>

            <Text mt="30px" mb="28px" color="gray.500">
                {description}
            </Text>

            <Link to={`/groups/${type}/${id}`}>
                <Text fontWeight="bold" color="#5867BC">
                    Details
                </Text>
            </Link>
        </Container>
    )
}
