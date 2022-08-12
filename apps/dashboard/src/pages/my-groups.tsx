import {
    Button,
    Center,
    Container,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Text
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import CreatGroupModal from "src/components/modal"
import GroupBox from "src/components/group-box"
import { Group } from "src/types/groups"
import useGroups from "src/hooks/useGroups"

export default function MyGroups(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [_selectedForm, setSelectedForm] = useState<string>("groups")
    const [_groupList, setGroupList] = useState<Group[] | null>(null)
    const { getGroupList } = useGroups()

    useEffect(() => {
        ;(async () => {
            const groupList = await getGroupList()
            setGroupList(groupList)
        })()
    }, [getGroupList, onClose])

    return (
        <Container maxW="container.xl">
            <Flex justifyContent="space-between" mt="43px">
                <Center>
                    <Heading fontSize="40px">My groups</Heading>
                </Center>
                <Center>
                    <Button
                        fontSize="lg"
                        bgColor="gray.800"
                        color="#FAFBFC"
                        _hover={{ bg: "gray.600" }}
                        onClick={onOpen}
                    >
                        New group
                    </Button>
                </Center>
            </Flex>
            <Flex
                justifyContent="flex-start"
                borderBottom="1px"
                borderColor="gray.200"
                h="76px"
                mt="24px"
            >
                <Center>
                    <Button
                        bgColor="rgba(0,0,0,0)"
                        onClick={() => {
                            setSelectedForm("groups")
                        }}
                    >
                        Groups
                    </Button>
                </Center>
                <Center>
                    <Button
                        bgColor="rgba(0,0,0,0)"
                        onClick={() => {
                            setSelectedForm("folders")
                        }}
                    >
                        Folders
                    </Button>
                </Center>
            </Flex>
            <Flex justifyContent="space-between" mt="16px">
                <InputGroup w="200px">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch />}
                    />
                    <Input placeholder="Search groups" />
                </InputGroup>
                <Select textAlign="center" w="max-content">
                    <option value="name">Name</option>
                    <option value="lastModified">Last modified</option>
                    <option value="lastOpened">Last opened</option>
                    <option value="groupSize">Group size</option>
                </Select>
            </Flex>
            <Center minH="400px" mt="70px" border="1px solid #E4E4E4">
                {_groupList && _groupList.length > 0 ? (
                    <GroupBox groupList={_groupList} />
                ) : (
                    <Flex flexDir="column">
                        <Text fontSize="2xl" fontWeight="bold">
                            You have not created any groups
                        </Text>
                        <Center mt="32px">
                            <Button
                                fontSize="lg"
                                bgColor="gray.800"
                                color="#FAFBFC"
                                _hover={{ bg: "gray.600" }}
                                width="fit-content"
                                onClick={onOpen}
                            >
                                Get Started!
                            </Button>
                        </Center>
                    </Flex>
                )}
            </Center>
            <CreatGroupModal isOpen={isOpen} onClose={onClose} />
        </Container>
    )
}
