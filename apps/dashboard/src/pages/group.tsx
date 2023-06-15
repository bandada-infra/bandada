import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Switch,
    Text,
    useDisclosure
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { CgProfile } from "react-icons/cg"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
    getGroup as getOffchainGroup,
    removeMember as removeOffchainGroupMember,
    updateGroup
} from "../api/bandadaAPI"
import { getGroup as getOnchainGroup } from "../api/semaphoreAPI"
import AddMemberModal from "../components/add-member-modal"
import InviteModal from "../components/invite-modal"
import { Group } from "../types"

export default function GroupPage(): JSX.Element {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { groupId, groupType } = useParams()
    const [group, setGroup] = useState<Group | null>()
    const [_status, setStatus] = useState<
        "default" | "loading" | "success" | "failure"
    >("default")

    useEffect(() => {
        ;(async () => {
            if (groupId) {
                setGroup(
                    groupType === "on-chain"
                        ? await getOnchainGroup(groupId)
                        : await getOffchainGroup(groupId)
                )
            }
        })()
    }, [groupId, groupType, navigate])

    async function onAPIAccessToggle(e: React.ChangeEvent<HTMLInputElement>) {
        const isEnabled = e.target.checked

        const res = await updateGroup(groupId as string, {
            apiEnabled: isEnabled
        })

        setGroup(res)
    }

    const removeMember = useCallback(
        async (member: string) => {
            if (group) {
                setStatus("loading")

                if (await removeOffchainGroupMember(group.id, member)) {
                    setStatus("success")

                    window.location.reload()
                } else {
                    setStatus("failure")
                }
            }
        },
        [group]
    )

    if (!group) {
        return <div />
    }

    return (
        <Container maxW="container.xl">
            <Box borderBottom="1px" borderColor="gray.200" pb="20px">
                <Flex mt="20px">
                    <Link to="/groups">
                        <IconButton
                            variant="link"
                            aria-label="Go back"
                            icon={<MdOutlineArrowBackIosNew />}
                        />
                    </Link>

                    <Text fontSize="sm" textTransform="uppercase">
                        all groups
                    </Text>
                </Flex>

                <Flex mt="30px" justifyContent="space-between">
                    <Heading fontSize="32px">{group.name}</Heading>
                    <Button
                        onClick={onOpen}
                        variant="solid"
                        fontWeight="400"
                        fontSize="16px"
                        border="1px solid #373A3E"
                    >
                        {groupType === "on-chain" ? "Add Member" : "New Invite"}
                    </Button>
                </Flex>

                {groupType === "off-chain" && (
                    <Flex justifyContent="space-between" mt="1rem">
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
                )}
            </Box>

            <Flex mt="30px">
                <Box w="100%">
                    <Text fontWeight="bold" fontSize="lg">
                        Members
                    </Text>

                    {!group.members?.length && (
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
                            {groupType === "off-chain" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    isLoading={_status === "loading"}
                                    onClick={() => removeMember(member)}
                                >
                                    Remove
                                </Button>
                            )}
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
                            <Text mt="5">
                                {group?.fingerprintDuration &&
                                    `Fingerprint Duration: ${group?.fingerprintDuration} seconds`}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>

            {groupType === "on-chain" ? (
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
