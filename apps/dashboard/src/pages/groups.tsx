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
    InputLeftElement,
    Select,
    Spinner,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { getGroups as getOffchainGroups } from "../api/bandadaAPI"
import { getGroups as getOnchainGroups } from "../api/semaphoreAPI"
import CreateGroupModal from "../components/create-group-modal"
import GroupCard from "../components/group-card"
import { AuthContext } from "../context/authContext"
import { Group } from "../types"

export default function GroupsPage(): JSX.Element {
    const { admin } = useContext(AuthContext)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [groups, setGroups] = useState<Group[]>([])
    const [searchField, setSearchField] = useState<string>("")

    useEffect(() => {
        ;(async () => {
            if (admin) {
                setIsLoading(true)
                setGroups([])

                await Promise.all([
                    getOnchainGroups(admin.address).then((onchainGroups) => {
                        if (onchainGroups) {
                            setGroups((groups) => [
                                ...groups,
                                ...onchainGroups.map((group) => ({
                                    ...group,
                                    type: "on-chain"
                                }))
                            ])
                        }
                    }),
                    getOffchainGroups(admin.id).then((offchainGroups) => {
                        if (offchainGroups) {
                            setGroups((groups) => [
                                ...groups,
                                ...offchainGroups.map((group) => ({
                                    ...group,
                                    type: "off-chain"
                                }))
                            ])
                        }
                    })
                ])

                setIsLoading(false)
            }
        })()
    }, [admin])

    const filterPredicate = useCallback(
        (group: Group) =>
            group.name.toLowerCase().includes(searchField.toLowerCase()),
        [searchField]
    )

    return (
        <Container maxW="container.xl">
            <VStack spacing={10}>
                <HStack justifyContent="space-between" width="100%">
                    <Heading fontSize="40px">Groups</Heading>
                    <Button
                        fontSize="lg"
                        variant="solid"
                        colorScheme="primary"
                        onClick={onOpen}
                    >
                        Add new group
                    </Button>
                </HStack>

                <HStack justifyContent="space-between" width="100%">
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
                </HStack>

                {isLoading && (
                    <Box pt="100px">
                        <Spinner />
                    </Box>
                )}

                {!isLoading && groups.length === 0 && (
                    <Text fontSize="2xl" fontWeight="bold" pt="100px">
                        You have not created any groups
                    </Text>
                )}

                {!isLoading && groups.length > 0 && (
                    <Grid
                        templateColumns="repeat(4, 1fr)"
                        gap={10}
                        w="100%"
                        mt="60px"
                    >
                        {groups.filter(filterPredicate).map((group) => (
                            <GridItem
                                w="100%"
                                borderRadius="4px"
                                bgColor="#FCFCFC"
                                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)"
                                key={group.name}
                            >
                                <GroupCard {...group} />
                            </GridItem>
                        ))}
                    </Grid>
                )}
            </VStack>

            <CreateGroupModal isOpen={isOpen} onClose={onClose} />
        </Container>
    )
}
