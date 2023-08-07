import {
    Box,
    Button,
    HStack,
    Icon,
    Input,
    Text,
    VStack
} from "@chakra-ui/react"
import { useState } from "react"
import { FiHardDrive, FiZap } from "react-icons/fi"
import capitalize from "../../utils/capitalize"

const groupTypes = ["off-chain", "on-chain"]

export type GeneralInfoStepProps = {
    group: any
    onSubmit: (group?: any, next?: boolean) => void
    onBack: () => void
}

export default function GeneralInfoStep({
    group,
    onSubmit,
    onBack
}: GeneralInfoStepProps): JSX.Element {
    const [_groupName, setGroupName] = useState<string>(group.name)
    const [_groupDescription, setGroupDescription] = useState<string>(
        group.description
    )

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
                        onClick={() =>
                            onSubmit({ ...group, type: groupType }, false)
                        }
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
                                {capitalize(groupType.replaceAll("-", " "))}
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
                    value={_groupName ?? ""}
                    maxLength={31}
                    onChange={(event) => setGroupName(event.target.value)}
                    onBlur={() =>
                        onSubmit({ ...group, name: _groupName }, false)
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
                        value={_groupDescription ?? ""}
                        onChange={(event) =>
                            setGroupDescription(event.target.value)
                        }
                        onBlur={() =>
                            onSubmit(
                                { ...group, description: _groupDescription },
                                false
                            )
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
                            ? "By continuing, you will create a group that will be stored in our servers."
                            : "By continuing, you will create a group that lives on the Ethereum blockchain."}
                    </Text>
                </Box>
            )}

            <HStack justify="right" pt="20px">
                <Button variant="solid" colorScheme="tertiary" onClick={onBack}>
                    Cancel
                </Button>
                <Button
                    isDisabled={
                        !group.type ||
                        !_groupName ||
                        (group.type === "off-chain" && !_groupDescription)
                    }
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
