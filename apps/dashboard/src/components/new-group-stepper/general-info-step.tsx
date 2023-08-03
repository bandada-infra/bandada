import {
    Box,
    Button,
    HStack,
    Icon,
    Input,
    Text,
    VStack
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiHardDrive, FiZap } from "react-icons/fi"
import capitalize from "../../utils/capitalize"

const groupTypes = ["on-chain", "off-chain"]

export type GeneralInfoStepProps = {
    group: any
    onSubmit: (group: any, next?: boolean) => void
    onBack: () => void
}

export default function GeneralInfoStep({
    group,
    onSubmit,
    onBack
}: GeneralInfoStepProps): JSX.Element {
    const [_groupType, setGroupType] = useState<string>()
    const [_groupName, setGroupName] = useState<string>()
    const [_groupDescription, setGroupDescription] = useState<string>()

    useEffect(() => {
        onSubmit({}, false)
    }, [onSubmit])

    return (
        <>
            <Text>What type of group is this?</Text>

            <HStack>
                {groupTypes.map((groupType: any) => (
                    <VStack
                        borderColor={
                            _groupType === groupType
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
                        onClick={() => setGroupType(groupType)}
                        key={groupType}
                    >
                        <HStack
                            bgColor={
                                _groupType === groupType
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
                                    _groupType === groupType
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
                />
                <Text fontSize="13px" color="balticSea.500">
                    Give it a cool name you can recognize.
                </Text>
            </VStack>

            {_groupType === "off-chain" && (
                <VStack align="left" pt="20px">
                    <Text>Description</Text>

                    <Input
                        size="lg"
                        minLength={10}
                        value={_groupDescription ?? ""}
                        onChange={(event) =>
                            setGroupDescription(event.target.value)
                        }
                    />
                    <Text fontSize="13px" color="balticSea.500">
                        Describe your group.
                    </Text>
                </VStack>
            )}

            {_groupType && (
                <Box pt="20px">
                    <Text
                        p="16px"
                        borderRadius="8px"
                        bgColor="classicRose.100"
                        color="classicRose.900"
                    >
                        {_groupType === "off-chain"
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
                        !_groupType ||
                        !_groupName ||
                        (_groupType === "off-chain" && !_groupDescription)
                    }
                    variant="solid"
                    colorScheme="primary"
                    onClick={() =>
                        onSubmit({
                            ...group,
                            name: _groupName,
                            description: _groupDescription,
                            type: _groupType
                        })
                    }
                >
                    Continue
                </Button>
            </HStack>
        </>
    )
}
