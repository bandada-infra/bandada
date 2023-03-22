import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    useDisclosure
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { CgProfile } from "react-icons/cg"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import AddMemberModal from "../components/add-member-modal"
import InviteModal from "../components/invite-modal"
import { Group } from "../types/groups"
import { getGroup as getOnchainGroup } from "../api/semaphoreAPI"
import { getGroup as getOffchainGroup, removeMember } from "../api/zkGroupsAPI"

export default function Manage(): JSX.Element {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { groupId } = useParams()
    const [_group, setGroup] = useState<Group | null>()
    const [updatedTime, setUpdatedTime] = useState(new Date())
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("type")
    const isOnChainGroup = pageOption === "on-chain"

    useEffect(() => {
        ;(async () => {
            if (groupId) {
                try {
                    if (isOnChainGroup) {
                        const onchainGroup = await getOnchainGroup(groupId)

                        if (onchainGroup) {
                            setGroup(onchainGroup)
                        }
                    } else {
                        const group = await getOffchainGroup(groupId || "")

                        if (group) {
                            setGroup(group)
                        }
                    }
                } catch (error) {
                    console.error(error)
                    navigate(`/group-not-found/${groupId}`)
                }
            }
        })()
    }, [groupId, navigate, isOnChainGroup, updatedTime])

    if (!_group) {
        return <div />
    }

    return (
        <Container maxW="container.xl">
            <Box borderBottom="1px" borderColor="gray.200">
                <Flex mt="40px" justifyContent="space-between">
                    <Heading fontSize="32px">{_group.name}</Heading>
                    <Button
                        onClick={onOpen}
                        variant="solid"
                        fontWeight="400"
                        fontSize="16px"
                        border="1px solid #373A3E"
                    >
                        {isOnChainGroup ? "Add Member" : "New Invite"}
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
                    {_group.members?.length ? (
                        <Box borderBottom="1px" borderColor="gray.200" p="16px">
                            <Text fontWeight="bold" fontSize="16px">
                                Identity Commitment
                            </Text>
                        </Box>
                    ) : (
                        <Text mt="5">No members in the group yet.</Text>
                    )}

                    {_group.members?.map((member) => (
                        <Flex
                            borderBottom="1px"
                            borderColor="gray.200"
                            p="16px"
                            alignItems="center"
                            justifyContent="space-between"
                            key={member}
                        >
                            <Flex>
                                <CgProfile size="20px" />
                                <Text fontSize="16px" ml="16px">
                                    {member}
                                </Text>
                            </Flex>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    if (
                                        window.confirm(
                                            "Are you sure you want to remove this member from the group?"
                                        )
                                    ) {
                                        await removeMember(_group.id, member)
                                        setUpdatedTime(new Date())
                                    }
                                }}
                            >
                                Remove
                            </Button>
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
                        {_group?.description && (
                            <Box>
                                <Text mb="10">{_group?.description}</Text>
                            </Box>
                        )}
                        <Box>
                            <Text mt="5">
                                Members: {_group?.members.length || "0"}
                            </Text>
                            <Text mt="5">
                                {_group?.treeDepth === 30
                                    ? "Capacity: 1 Billion"
                                    : _group?.treeDepth === 25
                                    ? "CapacityL 30 Million"
                                    : _group?.treeDepth === 20
                                    ? "Capacity: 500 Thousand"
                                    : "Capacity: 30 Thousand"}
                            </Text>
                            <Text mt="5">
                                {_group?.treeDepth === 30
                                    ? "Tree depth: 30"
                                    : _group?.treeDepth === 25
                                    ? "Tree depth: 25"
                                    : _group?.treeDepth === 20
                                    ? "Tree depth: 20"
                                    : "Tree depth: 16"}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            {isOnChainGroup ? (
                <AddMemberModal
                    isOpen={isOpen}
                    onClose={onClose}
                    groupName={_group.name}
                />
            ) : (
                <InviteModal
                    isOpen={isOpen}
                    onClose={onClose}
                    groupId={_group.id}
                />
            )}
        </Container>
    )
}
