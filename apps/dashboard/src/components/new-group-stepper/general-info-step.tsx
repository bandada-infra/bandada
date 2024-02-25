import {
    Button,
    HStack,
    Icon,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Tag,
    TagLabel,
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
    const [_fingerprintDuration, setFingerprintDuration] = useState<number>(
        group.fingerprintDuration
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
                            justify="space-between"
                        >
                            <HStack spacing="3">
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

                            {group.type === groupType && (
                                <Tag
                                    colorScheme="primary"
                                    borderRadius="full"
                                    borderWidth={1}
                                    borderColor="classicRose.900"
                                    color="classicRose.900"
                                    bgColor="classicRose.50"
                                >
                                    <TagLabel>selected</TagLabel>
                                </Tag>
                            )}
                        </HStack>

                        <Text color="balticSea.700" px="16px" py="10px">
                            {groupType === "on-chain"
                                ? "The group will be fully decentralized and will live on the Ethereum blockchain."
                                : "The group will be stored in the Bandada servers but the fingerprint will still be stored on-chain."}
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
                <>
                    <VStack align="left" pt="20px">
                        <Text>Description</Text>

                        <Input
                            size="lg"
                            minLength={10}
                            value={_groupDescription ?? ""}
                            onChange={(event) => {
                                setGroupDescription(event.target.value)
                            }}
                            onBlur={() =>
                                onSubmit(
                                    {
                                        ...group,
                                        description: _groupDescription
                                    },
                                    false
                                )
                            }
                        />
                        <Text fontSize="13px" color="balticSea.500">
                            Describe your group (at least 10 characters).
                        </Text>
                    </VStack>

                    <VStack align="left" pt="20px">
                        <Text>Fingerprint duration</Text>

                        <NumberInput
                            min={0}
                            size="lg"
                            value={_fingerprintDuration}
                            onChange={(value) =>
                                setFingerprintDuration(Number(value))
                            }
                            onBlur={() =>
                                onSubmit(
                                    {
                                        ...group,
                                        fingerprintDuration:
                                            _fingerprintDuration
                                    },
                                    false
                                )
                            }
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Text fontSize="13px" color="balticSea.500">
                            Select the validity time of old fingerprints in
                            milliseconds.
                        </Text>
                    </VStack>
                </>
            )}

            <HStack justify="right" pt="20px">
                <Button variant="solid" colorScheme="tertiary" onClick={onBack}>
                    Cancel
                </Button>
                <Button
                    isDisabled={
                        !group.type ||
                        !_groupName ||
                        (group.type === "off-chain" &&
                            _fingerprintDuration === undefined) ||
                        (group.type === "off-chain" && !_groupDescription) ||
                        (group.type === "off-chain" &&
                            _groupDescription.length < 10)
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
