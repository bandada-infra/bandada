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
    useDisclosure
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { useAccount } from "wagmi"
import { getGroups as getOffchainGroups } from "../api/bandadaAPI"
import { getGroups as getOnchainGroups } from "../api/semaphoreAPI"
import CreateGroupModal from "../components/create-group-modal"
import GroupBox from "../components/group-box"
import { Group } from "../types/groups"

export default function GroupsPage(): JSX.Element {
    const { address } = useAccount()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [_groupList, setGroupList] = useState<Group[] | null>()
    const [_searchedGroupList, setSearchedGroupList] = useState<Group[]>([])
    const [_searchField, setSearchField] = useState<string>("")

    useEffect(() => {
        ;(async () => {
            if (address) {
                setIsLoading(true)

                const onchainGroups = await getOnchainGroups(address as string)
                const offchainGroups = await getOffchainGroups()

                if (onchainGroups && offchainGroups) {
                    setGroupList([
                        ...onchainGroups.map((group) => ({
                            ...group,
                            type: "on-chain"
                        })),
                        ...offchainGroups.map((group) => ({
                            ...group,
                            type: "off-chain"
                        }))
                    ])
                }

                setIsLoading(false)
            }
        })()
    }, [address])

    useEffect(() => {
        if (_groupList) {
            setSearchedGroupList(
                _groupList.filter((group) =>
                    group.name
                        .toLowerCase()
                        .includes(_searchField.toLowerCase())
                )
            )
        }
    }, [_searchField, _groupList])

    return (
        <Container maxW="container.xl">
            <Flex justifyContent="space-between" mt="35px" mb="20px">
                <Center>
                    <Heading fontSize="40px">Groups</Heading>
                </Center>
                <Center>
                    <Button
                        fontSize="lg"
                        variant="solid"
                        colorScheme="primary"
                        onClick={onOpen}
                    >
                        Add new group
                    </Button>
                </Center>
            </Flex>

            <Flex justifyContent="space-between" mt="16px">
                <InputGroup w="200px">
                    <InputLeftElement pointerEvents="none">
                        <FiSearch />
                    </InputLeftElement>
                    <Input
                        placeholder="Search groups"
                        onChange={(e) => {
                            setSearchField(e.target.value)
                        }}
                    />
                </InputGroup>

                <Select textAlign="center" w="max-content">
                    <option value="name">Name</option>
                    <option value="lastModified">Last modified</option>
                    <option value="lastOpened">Last opened</option>
                    <option value="groupSize">Group size</option>
                </Select>
            </Flex>

            <GroupBox
                isLoading={isLoading}
                groupList={_searchedGroupList || []}
            />

            <CreateGroupModal isOpen={isOpen} onClose={onClose} />
        </Container>
    )
}
