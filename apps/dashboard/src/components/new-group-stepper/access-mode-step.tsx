import { validators } from "@bandada/reputation"
import { Box, HStack, Icon, Select, Text, VStack } from "@chakra-ui/react"
import { FiHardDrive, FiZap } from "react-icons/fi"
import capitalize from "../../utils/capitalize"

const accessModes = ["manual", "credentials"]

export type AccessMode = "manual" | "credentials"

export type AccessModeStepProps = {
    accessMode?: AccessMode
    onChange: (accessMode: AccessMode) => void
}

export default function AccessModeStep({
    accessMode: _accessMode,
    onChange
}: AccessModeStepProps): JSX.Element {
    return (
        <>
            <HStack>
                {accessModes.map((accessMode: any) => (
                    <VStack
                        borderColor={
                            _accessMode === accessMode
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
                        onClick={() => onChange(accessMode)}
                        key={accessMode}
                    >
                        <HStack
                            bgColor={
                                _accessMode === accessMode
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
                                    _accessMode === accessMode
                                        ? "classicRose.600"
                                        : "balticSea.600"
                                }
                                boxSize="5"
                                as={
                                    accessMode === "on-chain"
                                        ? FiZap
                                        : FiHardDrive
                                }
                            />

                            <Text>{capitalize(accessMode)}</Text>
                        </HStack>

                        <Text color="balticSea.700" px="16px" py="10px">
                            {accessMode === "manual"
                                ? "I’ll add members by pasting in their identity or sending them a generated invite link."
                                : "Members can join my group if they fit the criteria I will setup."}
                        </Text>
                    </VStack>
                ))}
            </HStack>

            {_accessMode === "credentials" && (
                <>
                    <VStack align="left" pt="20px">
                        <Text>Choose credential and provider</Text>

                        <Select size="lg" color="balticSea.400">
                            {validators.map((validator) => (
                                <option key={validator.id} value={validator.id}>
                                    {capitalize(
                                        validator.id
                                            .replaceAll("_", " ")
                                            .toLowerCase()
                                    )}
                                </option>
                            ))}
                        </Select>
                    </VStack>

                    <Box pt="20px">
                        <Text
                            p="16px"
                            borderRadius="8px"
                            bgColor="classicRose.100"
                            color="classicRose.900"
                        >
                            Disclaimer: We will use a bit of your member’s data
                            to check if they meet the criteria and generate
                            their reputation to join the group.
                        </Text>
                    </Box>
                </>
            )}
        </>
    )
}
