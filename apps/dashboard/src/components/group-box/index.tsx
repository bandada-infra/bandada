import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Spinner,
    Text,
    useDisclosure
} from "@chakra-ui/react"
import CreateGroupModal from "../create-group-modal"
import { Group } from "../../types/groups"
import GroupCard from "./group-card"

interface GroupList {
    groupList: Array<Group>
    isLoading: boolean
}

export default function GroupBox({
    groupList,
    isLoading
}: GroupList): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box>
            {isLoading && (
                <Box p="10" textAlign="center" w="100%">
                    <Spinner />
                </Box>
            )}

            {!isLoading && groupList.length > 0 && (
                <Grid
                    templateColumns="repeat(4, 1fr)"
                    gap={10}
                    w="100%"
                    mt="60px"
                >
                    {groupList.map((group) => (
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

            {!isLoading && groupList.length === 0 && (
                <Center
                    minH="400px"
                    mt="70px"
                    border="1px solid #E4E4E4"
                    borderRadius="4px"
                    bgColor="#FEFFFF"
                >
                    <Flex flexDir="column">
                        <Text fontSize="2xl" fontWeight="bold">
                            You have not created any groups
                        </Text>
                        <Center mt="32px">
                            <Button
                                fontSize="lg"
                                width="fit-content"
                                onClick={onOpen}
                                variant="solid"
                                colorScheme="primary"
                            >
                                Get Started!
                            </Button>
                        </Center>
                        <CreateGroupModal isOpen={isOpen} onClose={onClose} />
                    </Flex>
                </Center>
            )}
        </Box>
    )
}
