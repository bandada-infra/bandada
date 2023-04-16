import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Switch,
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
import {
    getGroup as getOffchainGroup,
    removeMember,
    updateGroup
} from "../api/bandadaAPI"

export default function Manage(): JSX.Element {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { groupId } = useParams()
    const [group, setGroup] = useState<Group | null>()
    const [updatedTime, setUpdatedTime] = useState(new Date())
    const [searchParams] = useSearchParams()

    useEffect(() => {
        ;(async () => {
            if (groupId) {
                try {
                    if (searchParams.has("on-chain")) {
                        const onchainGroup = await getOnchainGroup(groupId)

                        if (onchainGroup) {
                            setGroup(onchainGroup)
                        }
                    } else {
                        const _group = await getOffchainGroup(groupId || "")

                        if (_group) {
                            setGroup(_group)
                        }
                    }
                } catch (error) {
                    console.error(error)
                    navigate(`/group-not-found/${groupId}`)
                }
            }
        })()
    }, [groupId, navigate, searchParams, updatedTime])

    async function onAPIAccessToggle(e: React.ChangeEvent<HTMLInputElement>) {
        const isEnabled = e.target.checked
        const res = await updateGroup(groupId as string, {
            apiEnabled: isEnabled
        })
        setGroup(res)
    }

    if (!group) {
        return <div />
    }

    return (
        <Container maxW="container.xl">
            <Box borderBottom="1px" borderColor="gray.200">
                <Flex mt="40px" justifyContent="space-between">
                    <Heading fontSize="32px">{group.name}</Heading>
                    <Button
                        onClick={onOpen}
                        variant="solid"
                        fontWeight="400"
                        fontSize="16px"
                        border="1px solid #373A3E"
                    >
                        {searchParams.has("on-chain")
                            ? "Add Member"
                            : "New Invite"}
                    </Button>
                </Flex>

                <Flex
                    justifyContent="space-between"
                    py="1rem"
                    borderBottom="1px"
                    borderColor="gray.200"
                    mt="1rem"
                >
                    <Text w="50%">
                        {group?.treeDepth === 30
                            ? "Globe size group"
                            : group?.treeDepth === 25
                            ? "Nation size group"
                            : group?.treeDepth === 20
                            ? "City size group"
                            : "Community size group"}
                    </Text>

                        <Box w="50%">
                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="email-alerts" mb="0">
                                    Enable API Access
                                </FormLabel>
                                <Switch
                                    size="lg"
                                    id="enable-api"
                                    isChecked={group.apiEnabled}
                                    onChange={(e) => onAPIAccessToggle(e)}
                                />
                            </FormControl>

                            {group.apiEnabled && (
                                <InputGroup mt="1rem">
                                    <InputLeftAddon>API Key</InputLeftAddon>
                                    <Input
                                        value={group?.apiKey}
                                        isReadOnly
                                        onClick={(e) => {
                                            e.currentTarget.select()
                                        }}
                                    />
                                </InputGroup>
                            )}
                        </Box>
                </Flex>
            </Box>

            <Flex mt="30px">
                <Box w="100%">
                    <Text fontWeight="bold" fontSize="lg">
                        Members
                    </Text>
                    {group.members?.length ? (
                        <Box borderBottom="1px" borderColor="gray.200" p="16px">
                            <Text fontWeight="bold" fontSize="16px">
                                Identity Commitment
                            </Text>
                        </Box>
                    ) : (
                        <Text mt="5">No members in the group yet.</Text>
                    )}

                    {group.members?.map((member) => (
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
                                        await removeMember(group.id, member)
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
                        {group?.description && (
                            <Box>
                                <Text mb="10">{group?.description}</Text>
                            </Box>
                        )}
                        <Box>
                            <Text mt="5">
                                Members: {group?.members.length || "0"}
                            </Text>
                            <Text mt="5">
                                {group?.treeDepth === 30
                                    ? "Capacity: 1 Billion"
                                    : group?.treeDepth === 25
                                    ? "CapacityL 30 Million"
                                    : group?.treeDepth === 20
                                    ? "Capacity: 500 Thousand"
                                    : "Capacity: 30 Thousand"}
                            </Text>
                            <Text mt="5">
                                {group?.treeDepth === 30
                                    ? "Tree depth: 30"
                                    : group?.treeDepth === 25
                                    ? "Tree depth: 25"
                                    : group?.treeDepth === 20
                                    ? "Tree depth: 20"
                                    : "Tree depth: 16"}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            {searchParams.has("on-chain") ? (
                <AddMemberModal
                    isOpen={isOpen}
                    onClose={onClose}
                    groupName={group.name}
                />
            ) : (
                <InviteModal
                    isOpen={isOpen}
                    onClose={onClose}
                    groupId={group.id}
                />
            )}
        </Container>
    )
}
