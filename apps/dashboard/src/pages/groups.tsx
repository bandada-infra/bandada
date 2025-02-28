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
    VStack,
    Stack
} from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import { getGroups as getOffchainGroups } from "../api/bandadaAPI"
import { getGroups as getOnchainGroups } from "../api/semaphoreAPI"
import GroupCard from "../components/group-card"
import { AuthContext } from "../context/auth-context"
import { Group } from "../types"
import ApiKeyComponent from "../components/api-key"

export default function GroupsPage(): JSX.Element {
    const { admin } = useContext(AuthContext)
    const [_isLoading, setIsLoading] = useState(false)
    const [_groups, setGroups] = useState<Group[]>([])
    const [_allCredentialGroups, setAllCredentialGroups] = useState<Group[]>([])
    const [_searchField, setSearchField] = useState<string>("")
    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            if (admin) {
                setIsLoading(true)
                setGroups([])
                setAllCredentialGroups([])

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
                    }),
                    getOffchainGroups().then((allOffchainGroups) => {
                        if (allOffchainGroups) {
                            const credentialGroups = allOffchainGroups.filter(
                                (group) => group.credentials !== null
                            )
                            setAllCredentialGroups(credentialGroups)
                        }
                    })
                ])

                setIsLoading(false)
            }
        })()
    }, [admin])

    const filterGroup = useCallback(
        (group: Group) =>
            group.name.toLowerCase().includes(_searchField.toLowerCase()),
        [_searchField]
    )

    return (
        <Container maxW="container.xl" px="8" pb="20">
            <VStack spacing="9" flex="1">
                <HStack justifyContent="space-between" width="100%">
                    <Heading fontSize="40px" as="h1">
                        My groups ({_groups.length})
                    </Heading>
                </HStack>

                <Stack
                    justifyContent="space-between"
                    width={{ lg: "100%" }}
                    direction={{ base: "column", lg: "row" }}
                    spacing={2}
                >
                    <HStack>
                        <InputGroup w={{ base: "250px", md: "300px" }}>
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

                    <ApiKeyComponent adminId={admin?.id!} />

                    <Button
                        variant="solid"
                        colorScheme="primary"
                        onClick={() => navigate("/groups/new")}
                    >
                        Add group
                    </Button>
                </Stack>

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
                        templateColumns={{
                            base: "1fr",
                            md: "repeat(2, 1fr)",
                            xl: "repeat(3, 1fr)"
                        }}
                        gap={10}
                        w={{ md: "100%" }}
                        mt="60px"
                    >
                        {_groups
                            .filter(filterGroup)
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt || "").getTime() - // Convert string to Date object
                                    new Date(a.createdAt || "").getTime()
                            )
                            .map((group) => (
                                <Link
                                    key={group.id + group.name}
                                    to={`/groups/${group.type}/${group.id}`}
                                >
                                    <GridItem maxW="350px">
                                        <GroupCard {...group} />
                                    </GridItem>
                                </Link>
                            ))}
                    </Grid>
                )}

                <Box h="100px" />

                <HStack justifyContent="space-between" width="100%">
                    <Heading fontSize="40px" as="h1">
                        All credential groups ({_allCredentialGroups.length})
                    </Heading>
                </HStack>

                {_isLoading && (
                    <Box pt="100px">
                        <Spinner />
                    </Box>
                )}

                {!_isLoading && _allCredentialGroups.length === 0 && (
                    <Text fontSize="2xl" fontWeight="bold" pt="100px">
                        No credential groups found
                    </Text>
                )}

                {!_isLoading && _allCredentialGroups.length > 0 && (
                    <Grid
                        templateColumns={{
                            base: "1fr",
                            md: "repeat(2, 1fr)",
                            xl: "repeat(3, 1fr)"
                        }}
                        gap={10}
                        w={{ md: "100%" }}
                        mt="60px"
                    >
                        {_allCredentialGroups
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt || "").getTime() -
                                    new Date(a.createdAt || "").getTime()
                            )
                            .map((group) => (
                                <Link
                                    key={group.id + group.name}
                                    to={`/groups/${group.type}/${group.id}`}
                                >
                                    <GridItem maxW="350px">
                                        <GroupCard {...group} />
                                    </GridItem>
                                </Link>
                            ))}
                    </Grid>
                )}
            </VStack>
        </Container>
    )
}
