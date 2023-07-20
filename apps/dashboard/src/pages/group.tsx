import {
    Box,
    Button,
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
    Switch,
    Text,
    Tooltip,
    useClipboard,
    useDisclosure,
    VStack
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { CgProfile } from "react-icons/cg"
import { FiSearch } from "react-icons/fi"
import { MdOutlineArrowBackIosNew, MdOutlineCancel } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import * as bandadaApi from "../api/bandadaAPI"
import { getGroup as getOnchainGroup } from "../api/semaphoreAPI"
import copyIcon from "../assets/copy.svg"
import image1 from "../assets/image1.svg"
import AddMemberModal from "../components/add-member-modal"
import { Group } from "../types"
import shortenNumber from "../utils/shortenNumber"

export default function GroupPage(): JSX.Element {
    const navigate = useNavigate()
    const addMembersModal = useDisclosure()
    const { groupId, groupType } = useParams()
    const [_group, setGroup] = useState<Group | null>()
    const { hasCopied, setValue: setApiKey, onCopy } = useClipboard("")
    const [_searchMember, setSearchMember] = useState<string>("")
    const [_removeGroupName, setRemoveGroupName] = useState<string>("")

    useEffect(() => {
        ;(async () => {
            if (groupId) {
                const group =
                    groupType === "on-chain"
                        ? await getOnchainGroup(groupId)
                        : await bandadaApi.getGroup(groupId)

                if (group === null) {
                    alert("Some error occurred!")

                    return
                }

                setGroup(group)
            }
        })()
    }, [groupId, groupType])

    const onApiAccessToggle = useCallback(
        async (apiEnabled: boolean) => {
            const group = await bandadaApi.updateGroup(_group!.id as string, {
                apiEnabled
            })

            if (!group === null) {
                alert("Some error occurred!")

                return
            }

            setGroup(group)
        },
        [_group]
    )

    const addMember = useCallback(
        (memberId?: string) => {
            if (!memberId) {
                addMembersModal.onClose()

                return
            }

            _group!.members.push(memberId)

            setGroup({ ..._group! })

            addMembersModal.onClose()
        },
        [_group, addMembersModal]
    )

    const removeMember = useCallback(
        async (memberId: string) => {
            if (
                !window.confirm(
                    `Hare you sure you want to remove member '${memberId}'?`
                )
            ) {
                return
            }

            if (
                (await bandadaApi.removeMember(_group!.id, memberId)) === null
            ) {
                alert("Some error occurred!")

                return
            }

            _group!.members = _group!.members.filter((m) => m !== memberId)

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
        if (!window.confirm("Hare you sure you want to remove this group?")) {
            return
        }

        if ((await bandadaApi.removeGroup(_group!.id)) === null) {
            alert("Some error occurred!")

            return
        }

        navigate("/groups")
    }, [_group, navigate])

    return _group ? (
        <Container maxW="container.xl">
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

            <Heading mt="20px" fontSize="31px">
                {_group.name}
            </Heading>

            {_group.description && (
                <Text mt="15px" color="balticSea.800">
                    {_group.description}
                </Text>
            )}

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

                    {groupType === "off-chain" &&
                        !_group.reputationCriteria && (
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
                                                        aria-label="Copy invite link"
                                                        onClick={onCopy}
                                                        onMouseDown={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        icon={
                                                            <Image
                                                                src={copyIcon}
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
                                            onClick={() => {
                                                setApiKey(_group?.apiKey || "")
                                            }}
                                        >
                                            Generate new key
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )}

                    <Image src={image1} />

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
                                isDisabled={_removeGroupName !== _group.name}
                                onClick={removeGroup}
                            >
                                Remove group
                            </Button>
                        </HStack>
                    </Box>
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
                            variant="link"
                            color="balticSea.600"
                            textDecoration="underline"
                            onClick={addMembersModal.onOpen}
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
                                        <Icon
                                            color="balticSea.300"
                                            boxSize="5"
                                            as={CgProfile}
                                        />

                                        <Text color="balticSea.500" pl="10px">
                                            {memberId}
                                        </Text>
                                    </HStack>

                                    <IconButton
                                        aria-label="Remove member"
                                        variant="link"
                                        icon={
                                            <Icon
                                                color="#ac6b6e"
                                                boxSize="6"
                                                as={MdOutlineCancel}
                                            />
                                        }
                                        onClick={() => removeMember(memberId)}
                                    />
                                </HStack>
                            </Flex>
                        ))
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
