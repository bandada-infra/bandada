import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useMembers from "../hooks/useMembers"
import { Group } from "../types/groups"
import { CgProfile } from "react-icons/cg"
import { useDisclosure } from "@chakra-ui/react"
import InviteModal from "../components/invite-modal"
import AddMemberModal from "../components/add-member-modal"
import { useNavigate, useSearchParams } from "react-router-dom"
import useOnchainGroups from "../hooks/useOnchainGroups"

export default function Manage(): JSX.Element {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { groupName } = useParams()
    const { getGroup, getMembersList } = useMembers()
    const { getOnchainGroup } = useOnchainGroups()
    const [_group, setGroup] = useState<Group | null>()
    const [_membersList, setMembersList] = useState<string[] | null>()
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("type")

    useEffect(() => {
        ;(async () => {
            try {
                if (pageOption === "on-chain") {
                    const onchainGroup = await getOnchainGroup(groupName || "")
                    setGroup(onchainGroup)
                    setMembersList(onchainGroup?.members)
                } else {
                    const group = await getGroup(groupName || "")
                    if (group) {
                        setGroup(group)
                        const membersList = await getMembersList(
                            groupName || ""
                        )
                        setMembersList(membersList)
                    }
                }
            } catch (error) {
                console.error(error)
                navigate(`/group-not-found/${groupName}`)
            }
        })()
    }, [
        getGroup,
        groupName,
        getMembersList,
        navigate,
        getOnchainGroup,
        pageOption
    ])

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
                    {_group?.treeDepth === 30
                        ? "Globe size group"
                        : _group?.treeDepth === 25
                        ? "Nation size group"
                        : _group?.treeDepth === 20
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
                            key={member}
                        >
                            <CgProfile size="20px" />
                            <Text fontSize="16px" ml="16px">
                                {member}
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
                                {_group?.treeDepth === 30
                                    ? "Capacity 1 Billion"
                                    : _group?.treeDepth === 25
                                    ? "Capacity 30 Million"
                                    : _group?.treeDepth === 20
                                    ? "Capacity 500 Thousand"
                                    : "Capacity 30 Thousand"}
                            </Text>
                        </Box>
                        <Box>
                            <Text>
                                {_group?.treeDepth === 30
                                    ? "Tree depth 30"
                                    : _group?.treeDepth === 25
                                    ? "Tree depth 25"
                                    : _group?.treeDepth === 20
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
            {pageOption === "on-chain" ? (
                <AddMemberModal
                    isOpen={isOpen}
                    onClose={onClose}
                    groupName={groupName}
                />
            ) : (
                <InviteModal
                    isOpen={isOpen}
                    onClose={onClose}
                    groupName={groupName}
                />
            )}
        </Container>
    )
}
