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
import CreatGroupModal from "../components/creat-group-modal"
import GroupBox from "../components/group-box"
import GroupFolder from "../components/group-folder"
import useOffchainGroups from "../hooks/useOffchainGroups"
import useOnchainGroups from "../hooks/useOnchainGroups"
import { Group } from "../types/groups"
import { useNavigate, useSearchParams } from "react-router-dom"
import useEthereumWallet from "../hooks/useEthereumWallet"
import { request } from "@zk-groups/utils"
import { environment } from "../environments/environment"

export default function MyGroups(): JSX.Element {
    const [searchParams] = useSearchParams()
    const pageOption = searchParams.get("type")
    const { getOffchainGroupList } = useOffchainGroups()
    const { getOnchainGroupList } = useOnchainGroups()
    const { account } = useEthereumWallet()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const [jwtInCookies, setJwtInCookies] = useState(false)
    const [_selectedForm, setSelectedForm] = useState<string>("groups")
    const [_groupList, setGroupList] = useState<Group[] | null>()
    const [_searchedGroupList, setSearchedGroupList] = useState<Group[]>([])
    const [_searchField, setSearchField] = useState<string>("")
    const [_isOffchainGroup, setIsOffchainGroup] = useState<boolean>()

    useEffect(() => {
        ;(async () => {
            await request(`${environment.apiUrl}/auth/getUser`)
                .then((res) => {
                    setJwtInCookies(true)
                })
                .catch((e) => {
                    console.log("no jwt")
                    setJwtInCookies(false)
                })
        })()
    }, [])

    useEffect(() => {
        if (jwtInCookies) {
            setIsOffchainGroup(true)
        } else if (account) {
            setIsOffchainGroup(false)
        } else {
            navigate("/sso")
        }
    }, [account, navigate, jwtInCookies])

    useEffect(() => {
        ;(async () => {
            if (_isOffchainGroup) {
                const offchainGroupList = await getOffchainGroupList()
                setGroupList(offchainGroupList)
            } else {
                const onchainGroupList = await getOnchainGroupList(account)
                setGroupList(onchainGroupList)
            }
        })()
    }, [
        getOnchainGroupList,
        getOffchainGroupList,
        _isOffchainGroup,
        navigate,
        account
    ])

    useEffect(() => {
        _groupList &&
            setSearchedGroupList(
                _groupList.filter((group) =>
                    group.name
                        .toLowerCase()
                        .includes(_searchField.toLowerCase())
                )
            )
    }, [_searchField, _groupList])

    return (
        <Container maxW="container.xl">
            <Flex justifyContent="space-between" mt="43px">
                <Center>
                    <Heading fontSize="40px">My {pageOption} groups</Heading>
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
            {_selectedForm === "groups" ? (
                <GroupBox
                    groupList={_searchedGroupList ? _searchedGroupList : []}
                />
            ) : (
                <GroupFolder />
            )}
            <CreatGroupModal isOpen={isOpen} onClose={onClose} />
        </Container>
    )
}
