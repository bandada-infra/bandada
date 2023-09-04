import {
    Box,
    HStack,
    Image,
    Tag,
    TagLabel,
    Text,
    VStack
} from "@chakra-ui/react"
import icon1Image from "../assets/icon1.svg"
import icon2Image from "../assets/icon2.svg"
import icon3Image from "../assets/icon3.svg"
import icon4Image from "../assets/icon4.svg"

export type GroupCardProps = {
    name?: string
    type?: string
    description?: string
    members?: any[]
    treeDepth?: number
}

export default function GroupCard({
    name,
    type,
    description,
    members,
    treeDepth
}: GroupCardProps): JSX.Element {
    return (
        <VStack
            borderRadius="8px"
            borderColor="balticSea.200"
            borderWidth="1px"
            borderStyle="solid"
            bgColor="balticSea.100"
            flex="1"
            align="left"
            justify="space-between"
            fontFamily="DM Sans, sans-serif"
            p="24px"
            minW="330px"
            h="280px"
        >
            <Box>
                <HStack>
                    <Image
                        src={
                            !treeDepth
                                ? icon1Image
                                : treeDepth >= 27
                                ? icon4Image
                                : treeDepth >= 24
                                ? icon3Image
                                : treeDepth >= 20
                                ? icon2Image
                                : icon1Image
                        }
                        filter={treeDepth ? "inherit" : "grayscale(100%)"}
                        opacity={treeDepth ? "inherit" : ".4"}
                        htmlWidth="35px"
                        alt="Bandada icon"
                    />

                    <Tag
                        colorScheme="primary"
                        borderRadius="full"
                        borderWidth={1}
                        borderColor="classicRose.900"
                        color="classicRose.900"
                        bgColor="classicRose.50"
                    >
                        <TagLabel>{type || "on/off chain"}</TagLabel>
                    </Tag>
                </HStack>

                <Text
                    fontSize="20px"
                    mt="12px"
                    color={!name ? "balticSea.400" : "inherit"}
                >
                    {name || "[untitled]"}
                </Text>

                <Text
                    mt="12px"
                    color={!description ? "balticSea.300" : "balticSea.600"}
                >
                    {type !== "on-chain" &&
                        (description || "[no description yet]")}
                </Text>
            </Box>

            <VStack align="left" spacing="0">
                <Text
                    color={!members ? "balticSea.400" : "inherit"}
                    fontSize="20px"
                >
                    {members?.length || 0}
                </Text>
                <Text color={!members ? "balticSea.300" : "balticSea.400"}>
                    members
                </Text>
            </VStack>
        </VStack>
    )
}
