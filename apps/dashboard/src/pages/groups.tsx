import {
    Box,
    Button,
    Container,
    Grid,
    GridItem,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { getGroups as getOnchainGroups } from "../api/semaphoreAPI"
import { getGroups as getOffchainGroups } from "../api/bandadaAPI"
import CreateGroupModal from "../components/create-group-modal"
import GroupCard from "../components/group-card"
import { AuthContext } from "../context/auth-context"
import { Group } from "../types"

export default function GroupsPage(): JSX.Element {
    const { admin } = useContext(AuthContext)
    const createGroupModal = useDisclosure()
    const [_isLoading, setIsLoading] = useState(false)
    const [_groups, setGroups] = useState<Group[]>([])
    const [_searchField, setSearchField] = useState<string>("")

    useEffect(() => {
        ;(async () => {
            if (admin) {
                setIsLoading(true)
                setGroups([])

                await Promise.all([
                    getOnchainGroups(admin.address).then((onchainGroups) => {
                        if (onchainGroups) {
                            setGroups((groups) => [...groups, ...onchainGroups])
                        }
                    }),
                    getOffchainGroups(admin.id).then((offchainGroups) => {
                        if (offchainGroups) {
                            setGroups((groups) => [
                                ...groups,
                                ...offchainGroups
                            ])
                        }
                    })
                ])

                setIsLoading(false)
            }
        })()
    }, [admin])

    const addGroup = useCallback(
        (group?: Group) => {
            if (!group) {
                createGroupModal.onClose()

                return
            }

            setGroups([group, ..._groups])

            createGroupModal.onClose()
        },
        [_groups, createGroupModal]
    )

    const filterGroup = useCallback(
        (group: Group) =>
            group.name.toLowerCase().includes(_searchField.toLowerCase()),
        [_searchField]
    )

    return (
        <Container maxW="container.xl" px="8">
            <VStack spacing="9" flex="1">
                <HStack justifyContent="space-between" width="100%">
                    <Heading fontSize="40px" as="h1">
                        My groups
                    </Heading>
                </HStack>

                <HStack justifyContent="space-between" width="100%">
                    <HStack>
                        <InputGroup w="300px">
                            <InputRightElement h="48px" pointerEvents="none">
                                <FiSearch />
                            </InputRightElement>
                            <Input
                                bg="balticSea.50"
                                h="48px"
                                borderColor="balticSea.200"
                                fontSize="16px"
                                placeholder="Search by name, description"
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setSearchField("")
                                    }
                                }}
                            />
                        </InputGroup>
                        <Button
                            variant="solid"
                            colorScheme="tertiary"
                            onClick={(e: any) => {
                                setSearchField(
                                    e.target.previousSibling.lastChild.value
                                )
                            }}
                        >
                            Search
                        </Button>
                    </HStack>

                    <Button
                        variant="solid"
                        colorScheme="primary"
                        onClick={createGroupModal.onOpen}
                    >
                        Add group
                    </Button>
                </HStack>

                {_isLoading && (
                    <Box pt="100px">
                        <Spinner />
                    </Box>
                )}

                {!_isLoading && _groups.length === 0 && (
                    <Text fontSize="2xl" fontWeight="bold" pt="100px">
                        You have not created any groups
                    </Text>
                )}

                {!_isLoading && _groups.length > 0 && (
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={10}
                        w="100%"
                        mt="60px"
                    >
                        {_groups.filter(filterGroup).map((group) => (
                            <GridItem
                                borderRadius="8px"
                                borderColor="balticSea.200"
                                borderWidth="1px"
                                borderStyle="solid"
                                bgColor="balticSea.100"
                                key={group.name}
                            >
                                <GroupCard {...group} />
                            </GridItem>
                        ))}
                    </Grid>
                )}
            </VStack>

            <CreateGroupModal
                isOpen={createGroupModal.isOpen}
                onClose={addGroup}
            />
        </Container>
    )
}
