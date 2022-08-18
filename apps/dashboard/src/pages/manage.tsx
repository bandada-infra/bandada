import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useMembers from "src/hooks/useMembers"
import { Group } from "src/types/groups"
import { Member } from "src/types/members"
import { CgProfile } from "react-icons/cg"
import { useDisclosure } from "@chakra-ui/react"
import InviteModal from "src/components/invite-modal"

export default function Manage(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { groupName } = useParams()
    const { getGroup, getMembersList } = useMembers()
    const [_group, setGroup] = useState<Group | null>()
    const [_membersList, setMembersList] = useState<Member[] | null>()

    useEffect(() => {
        ;(async () => {
            if (groupName) {
                const group = await getGroup(groupName)
                setGroup(group)
                const membersList = await getMembersList(groupName)
                if (membersList) {
                    setMembersList(membersList)
                }
            }
        })()
    }, [getGroup, groupName, getMembersList])

    return (
        <Container maxW="container.xl">
            <Box borderBottom="1px" borderColor="gray.200">
                <Flex mt="40px" justifyContent="space-between">
                    <Heading fontSize="32px">{groupName}</Heading>
                    <Button
                        onClick={onOpen}
                        variant="solid"
                        fontWeight="400"
                        fontSize="16px"
                        border="1px solid #373A3E"
                    >
                        New Invite
                    </Button>
                </Flex>
                <Text mt="16px" mb="29px">
                    {_group?.size === "xl"
                        ? "Globe size group"
                        : _group?.size === "large"
                        ? "Nation size group"
                        : _group?.size === "medium"
                        ? "City size group"
                        : "Community size group"}
                </Text>
            </Box>
            <Flex mt="30px">
                <Box w="100%">
                    <Text fontWeight="bold" fontSize="lg">
                        Members
                    </Text>
                    <Box borderBottom="1px" borderColor="gray.200" p="16px">
                        <Text fontWeight="bold" fontSize="16px">
                            Identity Commitment
                        </Text>
                    </Box>
                    {_membersList?.map((member) => (
                        <Flex
                            borderBottom="1px"
                            borderColor="gray.200"
                            p="16px"
                            alignItems="center"
                        >
                            <CgProfile size="20px" />
                            <Text fontSize="16px" ml="16px">
                                {member.identityCommitment}
                            </Text>
                        </Flex>
                    ))}
                </Box>
                <Box w="320px" ml="78px">
                    <Text fontWeight="bold" fontSize="lg">
                        About
                    </Text>
                    <Flex
                        flexDir="column"
                        h="240px"
                        justifyContent="space-between"
                        mt="23px"
                    >
                        <Box>
                            <Text>{_group?.description}</Text>
                        </Box>
                        <Box>
                            <Text>{_group?.members.length} members</Text>
                            <Text mt="10">
                                {_group?.size === "xl"
                                    ? "Capacity 1 Billion"
                                    : _group?.size === "large"
                                    ? "Capacity 30 Million"
                                    : _group?.size === "medium"
                                    ? "Capacity 500 Thousand"
                                    : "Capacity 30 Thousand"}
                            </Text>
                        </Box>
                        <Box>
                            <Text>
                                {_group?.size === "xl"
                                    ? "Tree depth 30"
                                    : _group?.size === "large"
                                    ? "Tree depth 25"
                                    : _group?.size === "medium"
                                    ? "Tree depth 20"
                                    : "Tree depth 16"}
                            </Text>
                            <Text mt="10">
                                What is treedepth? Merkle trees are used to....
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <InviteModal isOpen={isOpen} onClose={onClose} />
        </Container>
    )
}
