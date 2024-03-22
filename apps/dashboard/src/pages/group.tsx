import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    // Switch,
    Text,
    Tooltip,
    useClipboard,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react"
import { useCallback, useEffect, useState, useContext } from "react"
import { CgProfile } from "react-icons/cg"
import { FiCopy, FiSearch } from "react-icons/fi"
import {
    MdOutlineArrowBackIosNew,
    MdOutlineCancel,
    MdOutlineMoreVert
} from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import * as bandadaApi from "../api/bandadaAPI"
import { getGroup as getOnchainGroup } from "../api/semaphoreAPI"
import image1 from "../assets/image1.svg"
import AddMemberModal from "../components/add-member-modal"
import { Group } from "../types"
import shortenMemberId from "../utils/shortenMemberId"
import shortenNumber from "../utils/shortenNumber"
import { AuthContext } from "../context/auth-context"

export default function GroupPage(): JSX.Element {
    const navigate = useNavigate()
    const addMembersModal = useDisclosure()
    const toast = useToast()
    const { groupId, groupType } = useParams()
    const [_group, setGroup] = useState<Group | null>()
    // const { hasCopied, setValue: setApiKey, onCopy } = useClipboard("")
    const { hasCopied: hasCopiedGroupId, onCopy: onCopyGroupId } = useClipboard(
        groupId || ""
    )
    const [_searchMember, setSearchMember] = useState<string>("")
    const [_removeGroupName, setRemoveGroupName] = useState<string>("")
    const [_selectedMembers, setSelectedMembers] = useState<string[]>([])
    const { admin } = useContext(AuthContext)
    const isGroupAdmin = !!(
        admin &&
        _group &&
        (groupType === "off-chain"
            ? _group.admin === admin.id
            : _group.admin === admin.address.toLowerCase())
    )

    useEffect(() => {
        ;(async () => {
            if (groupId) {
                const group =
                    groupType === "on-chain"
                        ? await getOnchainGroup(groupId)
                        : await bandadaApi.getGroup(groupId)

                if (group === null) {
                    return
                }

                // @todo needs refactoring to support the new logic.
                // setApiKey(group.apiKey || "")
                setGroup(group)
            }
        })()
    }, [
        groupId,
        groupType
        // setApiKey
    ])

    // const onApiAccessToggle = useCallback(
    //     async (apiEnabled: boolean) => {
    //         const group = await bandadaApi.updateGroup(_group!.id as string, {
    //             apiEnabled
    //         })

    //         if (group === null) {
    //             return
    //         }

    //         // @todo needs refactoring to support the new logic.
    //         // setApiKey(group.apiKey!)
    //         setGroup(group)
    //     },
    //     [_group, setApiKey]
    // )

    const addMember = useCallback(
        (memberIds?: string[]) => {
            if (!memberIds || memberIds.length === 0) {
                addMembersModal.onClose()
                return
            }

            _group!.members.push(...memberIds)

            setGroup({ ..._group! })

            addMembersModal.onClose()

            toast({
                title:
                    memberIds.length > 1 ? "Members added." : "Member added.",
                description:
                    memberIds.length > 1
                        ? " The members have been successfully added to the group."
                        : "The member has been successfully added to the group.",
                status: "success",
                duration: 3000
            })
        },
        [_group, addMembersModal, toast]
    )

    const removeMember = useCallback(
        async (memberId: string) => {
            if (
                !window.confirm(
                    `Are you sure you want to remove member '${memberId}'?`
                )
            ) {
                return
            }

            if (
                (await bandadaApi.removeMember(_group!.id, memberId)) === null
            ) {
                return
            }

            _group!.members = _group!.members.filter((m) => m !== memberId)

            setGroup({ ..._group! })
        },
        [_group]
    )

    const removeMembers = useCallback(
        async (memberIds: string[]) => {
            if (memberIds.length === 0) {
                alert(" No member is selected!")
                return
            }

            const confirmMessage = `
Are you sure you want to remove the following members?
${memberIds.join("\n")}
        `
            if (!window.confirm(confirmMessage)) {
                setSelectedMembers([])
                return
            }

            if (
                (await bandadaApi.removeMembers(_group!.id, memberIds)) === null
            ) {
                return
            }

            for (const memberId of memberIds) {
                _group!.members = _group!.members.filter((m) => m !== memberId)
            }

            setSelectedMembers([])
            setGroup({ ..._group! })
        },
        [_group]
    )

    const filterMember = useCallback(
        (memberId: string) =>
            memberId.toLowerCase().includes(_searchMember.toLowerCase()),
        [_searchMember]
    )

    const removeGroup = useCallback(async () => {
        if (!window.confirm("Are you sure you want to remove this group?")) {
            return
        }

        if ((await bandadaApi.removeGroup(_group!.id)) === null) {
            return
        }

        navigate("/groups")
    }, [_group, navigate])

    // const generateApiKey = useCallback(async () => {
    //     if (
    //         !window.confirm("Are you sure you want to generate a new API key?")
    //     ) {
    //         return
    //     }

    //     const apiKey = await bandadaApi.generateApiKey(_group!.id)

    //     if (apiKey === null) {
    //         return
    //     }

    //     _group!.apiKey = apiKey

    //     setApiKey(apiKey)
    //     setGroup({ ..._group! })
    // }, [_group, setApiKey])

    const toggleMemberSelection = (memberId: string) => {
        if (_selectedMembers.includes(memberId)) {
            setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
        } else {
            setSelectedMembers((prev) => [...prev, memberId])
        }
    }

    const handleSelectAll = () => {
        const visibleMembers = _group!.members?.filter(filterMember)

        if (visibleMembers) {
            setSelectedMembers(visibleMembers)
        }
    }

    const handleDeselectAll = () => {
        setSelectedMembers([])
    }
    let credentialsId = ""
    let credentialsCriteria = ""
    if (_group && _group.credentials) {
        const credentialsObj = JSON.parse(_group.credentials)
        credentialsId = `${credentialsObj.id}`

        if (credentialsObj.criteria) {
            for (const key in credentialsObj.criteria) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        credentialsObj.criteria,
                        key
                    )
                ) {
                    credentialsCriteria += `${key}:${credentialsObj.criteria[key]} `
                }
            }
        }
    }

    return _group ? (
        <Container maxW="container.xl" pb="20" px="8">
            <HStack mt="15px" ml="-5px">
                <Link to="/groups">
                    <HStack spacing="0">
                        <IconButton
                            variant="link"
                            aria-label="Go back"
                            icon={<MdOutlineArrowBackIosNew />}
                        />

                        <Text fontSize="sm" textTransform="uppercase">
                            all groups
                        </Text>
                    </HStack>
                </Link>
            </HStack>

            <VStack flex="1" align="start" spacing="6">
                <Heading mt="20px" fontSize="31px">
                    {_group.name}
                </Heading>

                {_group.description && (
                    <Text mt="15px" color="balticSea.800">
                        {_group.description}
                    </Text>
                )}
            </VStack>

            <HStack mt="30px" align="start" spacing="14">
                <VStack flex="1" align="stretch" spacing="6">
                    <HStack flex="1" spacing="4">
                        <Box
                            flex="1"
                            bgColor="balticSea.50"
                            p="25px 30px 12px 30px"
                            borderRadius="8px"
                        >
                            <Text fontSize="13px" color="balticSea.500">
                                MEMBERS
                            </Text>

                            <Heading fontSize="31px">
                                {shortenNumber(_group.members.length)}
                            </Heading>
                        </Box>
                        <Box
                            flex="1"
                            bgColor="balticSea.50"
                            p="25px 30px 12px 30px"
                            borderRadius="8px"
                        >
                            <Text fontSize="13px" color="balticSea.500">
                                MAX CAPACITY
                            </Text>

                            <Heading fontSize="31px">
                                {shortenNumber(2 ** _group.treeDepth)}
                            </Heading>
                        </Box>
                        <Box
                            flex="1"
                            bgColor="balticSea.50"
                            p="25px 30px 12px 30px"
                            borderRadius="8px"
                        >
                            <Text fontSize="13px" color="balticSea.500">
                                TREE DEPTH
                            </Text>

                            <Heading fontSize="31px">
                                {_group.treeDepth}
                            </Heading>
                        </Box>
                    </HStack>
                    (
                    <Box
                        bgColor="balticSea.50"
                        p="25px 30px 25px 30px"
                        borderRadius="8px"
                    >
                        <Text fontSize="20px">Group ID</Text>

                        <InputGroup size="lg" mt="10px">
                            <Input
                                pr="50px"
                                placeholder="Group ID"
                                value={groupId}
                                isDisabled
                            />

                            <InputRightElement mr="5px">
                                <Tooltip
                                    label={
                                        hasCopiedGroupId ? "Copied!" : "Copy"
                                    }
                                    closeOnClick={false}
                                    hasArrow
                                >
                                    <IconButton
                                        variant="link"
                                        aria-label="Copy Group id"
                                        onClick={onCopyGroupId}
                                        onMouseDown={(e) => e.preventDefault()}
                                        icon={
                                            <Icon
                                                color="sunsetOrange.600"
                                                boxSize="5"
                                                as={FiCopy}
                                            />
                                        }
                                    />
                                </Tooltip>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                    )
                    {groupType === "off-chain" && _group.credentials && (
                        <Box
                            bgColor="balticSea.50"
                            p="25px 30px 25px 30px"
                            borderRadius="8px"
                        >
                            <Text fontSize="20px">Credentials</Text>
                            <Input
                                pr="50px"
                                placeholder="Credentials ID"
                                mb="10px"
                                mt="10px"
                                value={credentialsId}
                                isDisabled
                            />
                            <Input
                                pr="50px"
                                placeholder="Credentials Criteria"
                                value={credentialsCriteria}
                                isDisabled
                            />
                        </Box>
                    )}
                    {/* {groupType === "off-chain" &&
                        !_group.credentials &&
                        isGroupAdmin && (
                            <Box
                                bgColor="balticSea.50"
                                p="25px 30px 25px 30px"
                                borderRadius="8px"
                            >
                                <HStack justify="space-between">
                                    <Text fontSize="20px">Use API key</Text>

                                    <Switch
                                        id="enable-api"
                                        isChecked={_group.apiEnabled}
                                        onChange={(event) =>
                                            onApiAccessToggle(
                                                event.target.checked
                                            )
                                        }
                                    />
                                </HStack>

                                <Text mt="10px" color="balticSea.700">
                                    Connect your app to your group using an API
                                    key.
                                </Text>

                                {_group.apiEnabled && (
                                    <>
                                        <InputGroup size="lg" mt="10px">
                                            <Input
                                                pr="50px"
                                                placeholder="API key"
                                                value={_group?.apiKey}
                                                isDisabled
                                            />

                                            <InputRightElement mr="5px">
                                                <Tooltip
                                                    label={
                                                        hasCopied
                                                            ? "Copied!"
                                                            : "Copy"
                                                    }
                                                    closeOnClick={false}
                                                    hasArrow
                                                >
                                                    <IconButton
                                                        variant="link"
                                                        aria-label="Copy API key"
                                                        onClick={onCopy}
                                                        onMouseDown={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        icon={
                                                            <Icon
                                                                color="sunsetOrange.600"
                                                                boxSize="5"
                                                                as={FiCopy}
                                                            />
                                                        }
                                                    />
                                                </Tooltip>
                                            </InputRightElement>
                                        </InputGroup>

                                        <Button
                                            mt="10px"
                                            variant="link"
                                            color="balticSea.600"
                                            textDecoration="underline"
                                            onClick={generateApiKey}
                                        >
                                            Generate new key
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )} */}
                    <Image src={image1} />
                    {_group.type === "off-chain" && isGroupAdmin && (
                        <Box
                            bgColor="classicRose.50"
                            p="25px 30px 25px 30px"
                            borderColor="sunsetOrange.500"
                            borderWidth="2px"
                            borderStyle="dashed"
                            borderRadius="8px"
                        >
                            <Text fontSize="20px" color="balticSea.900">
                                DANGER ZONE
                            </Text>

                            <Text my="10px" fontWeight="400">
                                To remove this group, type its name below.
                            </Text>

                            <HStack spacing="4">
                                <Input
                                    placeholder="Group name"
                                    size="lg"
                                    value={_removeGroupName}
                                    onChange={(event) =>
                                        setRemoveGroupName(event.target.value)
                                    }
                                />

                                <Button
                                    width="200px"
                                    variant="solid"
                                    colorScheme="danger"
                                    isDisabled={
                                        _removeGroupName !== _group.name
                                    }
                                    onClick={removeGroup}
                                >
                                    Remove group
                                </Button>
                            </HStack>
                        </Box>
                    )}
                </VStack>
                <Box
                    flex="1"
                    bgColor="balticSea.50"
                    p="25px 30px 25px 30px"
                    borderColor="classicRose.200"
                    borderWidth="1px"
                    borderRadius="8px"
                >
                    <HStack justify="space-between">
                        <Heading fontSize="25px" as="h1">
                            Members
                        </Heading>
                        <Button
                            variant="solid"
                            colorScheme="secondary"
                            onClick={addMembersModal.onOpen}
                            hidden={!isGroupAdmin}
                        >
                            Add member
                        </Button>
                    </HStack>

                    <HStack mt="30px" mb="20px">
                        <InputGroup w="100%">
                            <InputRightElement h="48px" pointerEvents="none">
                                <FiSearch />
                            </InputRightElement>
                            <Input
                                bg="balticSea.50"
                                h="48px"
                                borderColor="balticSea.200"
                                fontSize="16px"
                                placeholder="Search by id"
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setSearchMember("")
                                    }
                                }}
                            />
                        </InputGroup>
                        <Button
                            variant="solid"
                            colorScheme="tertiary"
                            onClick={(e: any) => {
                                setSearchMember(
                                    e.target.previousSibling.lastChild.value
                                )
                            }}
                        >
                            Search
                        </Button>
                    </HStack>

                    {!_group.members?.length ? (
                        <Text mt="5">No members in the group yet.</Text>
                    ) : (
                        _group.members?.filter(filterMember).map((memberId) => (
                            <Flex
                                p="16px"
                                alignItems="center"
                                justifyContent="space-between"
                                key={memberId}
                            >
                                <HStack justify="space-between" w="100%">
                                    <HStack>
                                        {_group.type === "off-chain" &&
                                            isGroupAdmin && (
                                                <Checkbox
                                                    isChecked={_selectedMembers.includes(
                                                        memberId
                                                    )}
                                                    onChange={() =>
                                                        toggleMemberSelection(
                                                            memberId
                                                        )
                                                    }
                                                />
                                            )}
                                        <Icon
                                            color="balticSea.300"
                                            boxSize="6"
                                            as={CgProfile}
                                        />

                                        <Text color="balticSea.500" pl="10px">
                                            {memberId.length > 16
                                                ? shortenMemberId(memberId, 8)
                                                : memberId}
                                        </Text>
                                    </HStack>

                                    {_group.type === "off-chain" &&
                                        isGroupAdmin && (
                                            <Menu>
                                                <MenuButton
                                                    as={IconButton}
                                                    aria-label="Options"
                                                    icon={
                                                        <Icon
                                                            color="balticSea.300"
                                                            boxSize="6"
                                                            as={
                                                                MdOutlineMoreVert
                                                            }
                                                        />
                                                    }
                                                    variant="link"
                                                />
                                                <MenuList>
                                                    <MenuItem
                                                        icon={
                                                            <Icon
                                                                mt="5px"
                                                                color="balticSea.300"
                                                                boxSize="6"
                                                                as={
                                                                    MdOutlineCancel
                                                                }
                                                            />
                                                        }
                                                        onClick={() =>
                                                            removeMember(
                                                                memberId
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        )}
                                </HStack>
                            </Flex>
                        ))
                    )}
                    {_group.type === "off-chain" && isGroupAdmin && (
                        <Flex mt="20px" justify="space-between" align="center">
                            <ButtonGroup>
                                <Button
                                    variant="solid"
                                    colorScheme="tertiary"
                                    onClick={handleSelectAll}
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="solid"
                                    colorScheme="tertiary"
                                    onClick={handleDeselectAll}
                                >
                                    Deselect
                                </Button>
                            </ButtonGroup>
                            <Button
                                variant="solid"
                                colorScheme="danger"
                                isDisabled={_selectedMembers.length === 0}
                                onClick={() => removeMembers(_selectedMembers)}
                                size="sm"
                            >
                                Remove Selected Members
                            </Button>
                        </Flex>
                    )}
                </Box>
            </HStack>

            <AddMemberModal
                isOpen={addMembersModal.isOpen}
                onClose={addMember}
                group={_group}
            />
        </Container>
    ) : (
        <div />
    )
}
