import { Container, Heading, Text } from "@chakra-ui/react"
import { Link, useSearchParams } from "react-router-dom"
import { Group } from "../../types/groups"

export default function GroupCard({
    name,
    description,
    members,
    id
}: Group): JSX.Element {
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("type")
    return (
        <Container p="20px" maxW="276">
            <Heading fontSize="2xl">{name}</Heading>
            <Text mt="10px" color="gray.500">
                {members.length} members
            </Text>
            <Text mt="30px" mb="28px" color="gray.500">
                {description}
            </Text>
            <Link to={`/my-groups/${id}?type=${pageOption}`}>
                <Text fontWeight="bold" color="#5867BC">
                    Manage
                </Text>
            </Link>
        </Container>
    )
}
