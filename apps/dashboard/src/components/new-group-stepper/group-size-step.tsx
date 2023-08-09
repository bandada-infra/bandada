import {
    Button,
    Heading,
    HStack,
    Image,
    ListItem,
    Tag,
    Text,
    UnorderedList,
    VStack
} from "@chakra-ui/react"
import icon1Image from "../../assets/icon1.svg"
import icon2Image from "../../assets/icon2.svg"
import icon3Image from "../../assets/icon3.svg"
import icon4Image from "../../assets/icon4.svg"
import { groupSizes } from "../../data"

export type GroupSizeStepProps = {
    group: any
    onSubmit: (group?: any, next?: boolean) => void
    onBack: () => void
}

export default function GroupSizeStep({
    group,
    onSubmit,
    onBack
}: GroupSizeStepProps): JSX.Element {
    return (
        <>
            <Text>How big is your group?</Text>

            <HStack w="764px" py="16px" overflowX="scroll">
                {groupSizes.map((groupSize) => (
                    <VStack
                        borderColor={
                            group.treeDepth === groupSize.treeDepth
                                ? "classicRose.600"
                                : "balticSea.300"
                        }
                        borderWidth="2px"
                        borderRadius="8px"
                        minW="320px"
                        h="370px"
                        align="start"
                        spacing="0"
                        cursor="pointer"
                        p="16px"
                        onClick={() =>
                            onSubmit(
                                { ...group, treeDepth: groupSize.treeDepth },
                                false
                            )
                        }
                        key={groupSize.name}
                    >
                        <Image
                            src={
                                groupSize.treeDepth >= 27
                                    ? icon4Image
                                    : groupSize.treeDepth >= 24
                                    ? icon3Image
                                    : groupSize.treeDepth >= 20
                                    ? icon2Image
                                    : icon1Image
                            }
                            filter={
                                group.treeDepth === groupSize.treeDepth
                                    ? "inherit"
                                    : "grayscale(100%)"
                            }
                            opacity={
                                group.treeDepth === groupSize.treeDepth
                                    ? "inherit"
                                    : ".4"
                            }
                            htmlWidth="50px"
                            alt="Bandada icon"
                        />

                        <Heading fontSize="25px" as="h1" pt="16px" pb="10px">
                            {groupSize.name}
                        </Heading>

                        <Tag
                            colorScheme="primary"
                            borderRadius="full"
                            borderWidth={1}
                            borderColor="classicRose.900"
                            color="classicRose.900"
                            bgColor="classicRose.50"
                            filter={
                                group.treeDepth === groupSize.treeDepth
                                    ? "inherit"
                                    : "grayscale(100%)"
                            }
                            opacity={
                                group.treeDepth === groupSize.treeDepth
                                    ? "inherit"
                                    : ".5"
                            }
                        >
                            {groupSize.capacity}
                        </Tag>

                        <Text color="balticSea.500" py="10px">
                            {groupSize.description}
                        </Text>

                        <Text color="balticSea.700" pt="10px">
                            Anonymously:
                        </Text>
                        <UnorderedList color="balticSea.700" pl="20px">
                            {groupSize.useCases.map((useCase) => (
                                <ListItem key={useCase}>{useCase}</ListItem>
                            ))}
                        </UnorderedList>
                    </VStack>
                ))}
            </HStack>

            <HStack justify="right" pt="20px">
                <Button variant="solid" colorScheme="tertiary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    isDisabled={!group.treeDepth}
                    variant="solid"
                    colorScheme="primary"
                    onClick={() => onSubmit()}
                >
                    Continue
                </Button>
            </HStack>
        </>
    )
}
