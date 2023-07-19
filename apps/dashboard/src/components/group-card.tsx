import {
    Box,
    HStack,
    Image,
    Tag,
    TagLabel,
    Text,
    VStack
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import icon1Image from "../assets/icon1.svg"
import icon2Image from "../assets/icon2.svg"
import icon3Image from "../assets/icon3.svg"
import icon4Image from "../assets/icon4.svg"
import { Group } from "../types"

export default function GroupCard({
    name,
    type,
    description,
    members,
    treeDepth,
    id
}: Group): JSX.Element {
    return (
        <Link to={`/groups/${type}/${id}`}>
            <VStack
                flex="1"
                align="left"
                justify="space-between"
                fontFamily="DM Sans, sans-serif"
                p="24px"
                w="350px"
                h="280px"
            >
                <Box>
                    <HStack>
                        <Image
                            src={
                                treeDepth >= 27
                                    ? icon4Image
                                    : treeDepth >= 24
                                    ? icon3Image
                                    : treeDepth >= 20
                                    ? icon2Image
                                    : icon1Image
                            }
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
                            <TagLabel>{type}</TagLabel>
                        </Tag>
                    </HStack>

                    <Text fontSize="20px" mt="12px">
                        {name}
                    </Text>

                    <Text mt="12px" color="balticSea.600">
                        {description}
                    </Text>
                </Box>

                <VStack align="left" spacing="0">
                    <Text fontSize="20px">{members.length}</Text>
                    <Text color="balticSea.400">members</Text>
                </VStack>
            </VStack>
        </Link>
    )
}
