import { Box, HStack, Icon, Input, Text, VStack } from "@chakra-ui/react"
import { FiHardDrive, FiZap } from "react-icons/fi"

const groupTypes = ["on-chain", "off-chain"]

export type GeneralInfoStepProps = {
    group: any
    onChange: (group: any) => void
}

export default function GeneralInfoStep({
    group,
    onChange
}: GeneralInfoStepProps): JSX.Element {
    return (
        <>
            <Text>What type of group is this?</Text>

            <HStack>
                {groupTypes.map((groupType: any) => (
                    <VStack
                        borderColor={
                            group.type === groupType
                                ? "classicRose.600"
                                : "balticSea.200"
                        }
                        borderWidth="2px"
                        borderRadius="8px"
                        w="252px"
                        h="210px"
                        align="left"
                        spacing="0"
                        cursor="pointer"
                        onClick={() => onChange({ ...group, type: groupType })}
                        key={groupType}
                    >
                        <HStack
                            bgColor={
                                group.type === groupType
                                    ? "classicRose.100"
                                    : "balticSea.100"
                            }
                            px="20px"
                            py="15px"
                            borderTopRadius="8px"
                            spacing="3"
                        >
                            <Icon
                                color={
                                    group.type === groupType
                                        ? "classicRose.600"
                                        : "balticSea.600"
                                }
                                boxSize="5"
                                as={
                                    groupType === "on-chain"
                                        ? FiZap
                                        : FiHardDrive
                                }
                            />

                            <Text>
                                {groupType === "on-chain"
                                    ? "On chain"
                                    : "Off chain"}
                            </Text>
                        </HStack>

                        <Text color="balticSea.700" px="16px" py="10px">
                            Quick summary of pros and cons of on-chain groups,
                            spanning about 3 lines?
                        </Text>
                    </VStack>
                ))}
            </HStack>

            <VStack align="left" pt="20px">
                <Text>Name</Text>

                <Input
                    size="lg"
                    value={group.name ?? ""}
                    onChange={(event) =>
                        onChange({ ...group, name: event.target.value })
                    }
                />
                <Text fontSize="13px" color="balticSea.500">
                    Give it a cool name you can recognize.
                </Text>
            </VStack>

            {group.type === "off-chain" && (
                <VStack align="left" pt="20px">
                    <Text>Description</Text>

                    <Input
                        size="lg"
                        minLength={10}
                        value={group.description ?? ""}
                        onChange={(event) =>
                            onChange({
                                ...group,
                                description: event.target.value
                            })
                        }
                    />
                    <Text fontSize="13px" color="balticSea.500">
                        Describe your group.
                    </Text>
                </VStack>
            )}

            {group.type && (
                <Box pt="20px">
                    <Text
                        p="16px"
                        borderRadius="8px"
                        bgColor="classicRose.100"
                        color="classicRose.900"
                    >
                        {group.type === "off-chain"
                            ? "By continuing, you will create that will be stored in our servers."
                            : "By continuing, you will create that lives on the Ethereum blockchain."}
                    </Text>
                </Box>
            )}
        </>
    )
}
