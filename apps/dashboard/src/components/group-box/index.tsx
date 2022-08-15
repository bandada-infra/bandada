import {
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Text,
    useDisclosure
} from "@chakra-ui/react"
import { Group } from "src/types/groups"
import GroupCard from "./group-card"
import CreatGroupModal from "src/components/creat-group-modal"

interface GroupList {
    groupList: Array<Group>
}

export default function GroupBox({ groupList }: GroupList): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Center minH="400px" mt="70px" border="1px solid #E4E4E4">
            {groupList.length > 0 ? (
                <Grid
                    templateColumns="repeat(4, 1fr)"
                    gap={10}
                    p="20px"
                    w="100%"
                >
                    {groupList.map((group) => (
                        <GridItem w="100%" border="1px">
                            <GroupCard {...group} />
                        </GridItem>
                    ))}
                </Grid>
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
                    <CreatGroupModal isOpen={isOpen} onClose={onClose} />
                </Flex>
            )}
        </Center>
    )
}
