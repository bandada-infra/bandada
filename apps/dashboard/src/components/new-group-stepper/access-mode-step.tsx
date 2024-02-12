import { validators } from "@bandada/credentials"
import {
    Box,
    Button,
    HStack,
    Icon,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Tag,
    TagLabel,
    Text,
    VStack
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiPencil } from "react-icons/bi"
import { GoGear } from "react-icons/go"
import capitalize from "../../utils/capitalize"

const accessModes = ["manual", "credentials"]

export type AccessMode = "manual" | "credentials"

export type AccessModeStepProps = {
    group: any
    onSubmit: (group: any) => void
    onBack: () => void
}

export default function AccessModeStep({
    group,
    onSubmit,
    onBack
}: AccessModeStepProps): JSX.Element {
    const [_accessMode, setAccessMode] = useState<AccessMode>("manual")
    const [_validator, setValidator] = useState<number>(0)
    const [_credentials, setCredentials] = useState<any>()

    useEffect(() => {
        setCredentials({
            id: validators[_validator].id,
            criteria: {}
        })
    }, [_validator])

    useEffect(() => {
        if (_accessMode === "manual") {
            setCredentials(undefined)
        } else {
            setCredentials({
                id: validators[_validator].id,
                criteria: {}
            })
        }
    }, [_accessMode, _validator])

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
                        w="260px"
                        h="210px"
                        align="left"
                        spacing="0"
                        cursor="pointer"
                        onClick={() => setAccessMode(accessMode)}
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
                            justify="space-between"
                        >
                            <HStack spacing="3">
                                <Icon
                                    color={
                                        _accessMode === accessMode
                                            ? "classicRose.600"
                                            : "balticSea.600"
                                    }
                                    boxSize="5"
                                    as={
                                        accessMode === "manual"
                                            ? BiPencil
                                            : GoGear
                                    }
                                />

                                <Text>{capitalize(accessMode)}</Text>
                            </HStack>

                            {_accessMode === accessMode && (
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

                        <Select
                            size="lg"
                            value={_validator}
                            onChange={(event) =>
                                setValidator(Number(event.target.value))
                            }
                        >
                            {validators.map((validator, i) => (
                                <option key={validator.id} value={i}>
                                    {capitalize(
                                        validator.id
                                            .replaceAll("_", " ")
                                            .toLowerCase()
                                    )}
                                </option>
                            ))}
                        </Select>
                    </VStack>

                    {_credentials &&
                        _credentials.criteria &&
                        Object.entries(validators[_validator].criteriaABI).map(
                            (parameter) => (
                                <VStack
                                    align="left"
                                    pt="20px"
                                    key={parameter[0]}
                                >
                                    <Text>{capitalize(parameter[0])}</Text>

                                    {parameter[1] === "number" ? (
                                        <NumberInput
                                            size="lg"
                                            value={
                                                _credentials.criteria[
                                                    parameter[0]
                                                ]
                                            }
                                            onChange={(value) =>
                                                setCredentials({
                                                    ..._credentials,
                                                    criteria: {
                                                        ..._credentials.criteria,
                                                        [parameter[0]]:
                                                            Number(value)
                                                    }
                                                })
                                            }
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    ) : (
                                        <Input
                                            size="lg"
                                            value={
                                                _credentials.criteria[
                                                    parameter[0]
                                                ]
                                            }
                                            onChange={(event) =>
                                                setCredentials({
                                                    ..._credentials,
                                                    criteria: {
                                                        ..._credentials.criteria,
                                                        [parameter[0]]:
                                                            event.target.value
                                                    }
                                                })
                                            }
                                            
                                            placeholder={
                                                parameter[0] === "repository"
                                                    ? "Enter Repository Owner / Repository Name"
                                                    : `Enter ${capitalize(parameter[0])}`
                                            }
                            
                                           
                                        />
                                    )}
                                </VStack>
                            )
                        )}

                    <Box pt="20px">
                        <Text
                            p="16px"
                            borderRadius="8px"
                            bgColor="classicRose.100"
                            color="classicRose.900"
                        >
                            Disclaimer: We will use a bit of your member’s data
                            to check if they meet the criteria and generate
                            their credentials to join the group.
                        </Text>
                    </Box>
                </>
            )}

            <HStack justify="right" pt="20px">
                <Button variant="solid" colorScheme="tertiary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    isDisabled={
                        !_accessMode ||
                        (_accessMode === "credentials" &&
                            (!_credentials ||
                                !_credentials.criteria ||
                                Object.keys(_credentials.criteria).length !==
                                    Object.keys(
                                        validators[_validator].criteriaABI
                                    ).length ||
                                Object.values(_credentials.criteria).some(
                                    (c) => c === undefined
                                )))
                    }
                    variant="solid"
                    colorScheme="primary"
                    onClick={() => {
                        onSubmit({
                            ...group,
                            credentials: _credentials
                        })
                    }}
                >
                    Continue
                </Button>
            </HStack>
        </>
    )
}
