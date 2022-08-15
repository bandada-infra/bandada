import {
    Button,
    Center,
    Container,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Select
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import CreatGroupModal from "src/components/creat-group-modal"
import GroupBox from "src/components/group-box"
import GroupFolder from "src/components/group-folder"
import { Group } from "src/types/groups"
import useGroups from "src/hooks/useGroups"

export default function MyGroups(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [_selectedForm, setSelectedForm] = useState<string>("groups")
    const [_groupList, setGroupList] = useState<Group[] | null>()
    const { getGroupList } = useGroups()

    useEffect(() => {
        ;(async () => {
            const groupList = await getGroupList()
            setGroupList(groupList)
        })()
    }, [getGroupList])

    return (
        <Container maxW="container.xl">
            <Flex justifyContent="space-between" mt="43px">
                <Center>
                    <Heading fontSize="40px">My groups</Heading>
                </Center>
                <Center>
                    <Button
                        fontSize="lg"
                        variant="solid"
                        colorScheme="primary"
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
                <Center
                    borderBottom={_selectedForm === "groups" ? "2px" : "none"}
                >
                    <Button
                        variant="solid"
                        color={
                            _selectedForm === "groups"
                                ? "primary.900"
                                : "primary.500"
                        }
                        onClick={() => {
                            setSelectedForm("groups")
                        }}
                    >
                        Groups
                    </Button>
                </Center>
                <Center
                    borderBottom={_selectedForm === "folders" ? "2px" : "none"}
                >
                    <Button
                        variant="solid"
                        color={
                            _selectedForm === "folders"
                                ? "primary.900"
                                : "primary.500"
                        }
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
            {_selectedForm === "groups" ? (
                <GroupBox groupList={_groupList ? _groupList : []} />
            ) : (
                <GroupFolder />
            )}
            <CreatGroupModal isOpen={isOpen} onClose={onClose} />
        </Container>
    )
}
