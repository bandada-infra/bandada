import { validators } from "@bandada/credentials"
import { blockchainCredentialSupportedNetworks } from "@bandada/utils"
import {
    Box,
    Button,
    Checkbox,
    HStack,
    Icon,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    SimpleGrid,
    Tag,
    TagLabel,
    Text,
    VStack
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiPencil } from "react-icons/bi"
import { GoGear } from "react-icons/go"
import capitalize from "../../utils/capitalize"

const accessModes = ["manual", "credentials", "multiple_credentials"]

export type AccessMode = "manual" | "credentials" | "multiple_credentials"

const logicalOperators = ["and", "or", "not", "xor", "(", ")"]

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

    const [_validators, setValidators] = useState<number[]>([]) // selected validators for multiple credentials
    const [_expression, setExpression] = useState<string[]>([]) // Expression with logical operators for multiple credentials

    useEffect(() => {
        setCredentials({
            id: validators[_validator].id,
            criteria: {}
        })
    }, [_validator])

    useEffect(() => {
        if (_accessMode === "manual") {
            setCredentials(undefined)
        } else if (_accessMode === "credentials") {
            setCredentials({
                id: validators[_validator].id,
                criteria: {}
            })
        }
    }, [_accessMode, _validator, _validators])

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

                                <Text>
                                    {capitalize(
                                        accessMode.replaceAll("_", " ")
                                    )}
                                </Text>
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
                            (parameter: any) => (
                                <VStack
                                    align="left"
                                    pt="20px"
                                    key={parameter[0]}
                                >
                                    <Text>
                                        {capitalize(
                                            `${parameter[0]}${
                                                parameter[1].optional ? "" : "*"
                                            }`
                                        )}
                                    </Text>

                                    {parameter[1].type === "number" && (
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
                                    )}
                                    {parameter[0] !== "network" &&
                                        parameter[1].type === "string" && (
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
                                                                event.target
                                                                    .value
                                                        }
                                                    })
                                                }
                                                placeholder={
                                                    parameter[0] ===
                                                    "repository"
                                                        ? "<repo-owner>/<repo-name>"
                                                        : undefined
                                                }
                                            />
                                        )}
                                    {parameter[0] === "network" &&
                                        parameter[1].type === "string" && (
                                            <Select
                                                size="lg"
                                                placeholder="Select network"
                                                onChange={(event) =>
                                                    setCredentials({
                                                        ..._credentials,
                                                        criteria: {
                                                            ..._credentials.criteria,
                                                            [parameter[0]]:
                                                                event.target
                                                                    .value
                                                        }
                                                    })
                                                }
                                            >
                                                {blockchainCredentialSupportedNetworks.map(
                                                    (network: any) => (
                                                        <option
                                                            value={network.name}
                                                        >
                                                            {network.name}
                                                        </option>
                                                    )
                                                )}
                                            </Select>
                                        )}
                                    {parameter[1].type === "boolean" && (
                                        <Checkbox
                                            isChecked={
                                                _credentials.criteria[
                                                    parameter[0]
                                                ]
                                            }
                                            onChange={(e) =>
                                                setCredentials({
                                                    ..._credentials,
                                                    criteria: {
                                                        ..._credentials.criteria,
                                                        [parameter[0]]:
                                                            e.target.checked
                                                    }
                                                })
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

            {_accessMode === "multiple_credentials" && (
                <>
                    <Text pb="20px">Choose credentials</Text>

                    <SimpleGrid columns={2} spacing={10}>
                        <VStack>
                            <Text>Credentials</Text>
                            <VStack>
                                {validators.map((validator, i) => (
                                    <Button
                                        key={validator.id}
                                        variant="solid"
                                        colorScheme="tertiary"
                                        onClick={() => {
                                            setValidators([..._validators, i])
                                            setExpression([
                                                ..._expression,
                                                i.toString()
                                            ])

                                            const tempCredential = {
                                                ..._credentials
                                            }

                                            if (
                                                tempCredential.credentials !==
                                                undefined
                                            ) {
                                                tempCredential.credentials.push(
                                                    {
                                                        id: validators[i].id,
                                                        criteria: {}
                                                    }
                                                )
                                            } else {
                                                tempCredential.credentials = [
                                                    {
                                                        id: validators[i].id,
                                                        criteria: {}
                                                    }
                                                ]
                                            }

                                            setCredentials(tempCredential)
                                        }}
                                        w="200px"
                                    >
                                        {capitalize(
                                            validator.id
                                                .replaceAll("_", " ")
                                                .toLowerCase()
                                        )}
                                    </Button>
                                ))}
                            </VStack>
                        </VStack>
                        <VStack>
                            <Text>Logical Operators</Text>
                            <VStack>
                                {logicalOperators.map((lo) => (
                                    <Button
                                        key={lo}
                                        variant="solid"
                                        colorScheme="tertiary"
                                        onClick={() => {
                                            setExpression([..._expression, lo])
                                        }}
                                        w="50px"
                                    >
                                        {lo.toUpperCase()}
                                    </Button>
                                ))}
                            </VStack>
                        </VStack>
                    </SimpleGrid>

                    <VStack align="left">
                        <Text>Expression</Text>
                        <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                        >
                            {_expression.length > 0
                                ? _expression
                                      .map((elem) => {
                                          const isLogicalOperator =
                                              logicalOperators.includes(elem)
                                          if (isLogicalOperator) {
                                              return elem.toUpperCase()
                                          }
                                          return capitalize(
                                              validators[
                                                  Number(elem)
                                              ].id.toLowerCase()
                                          )
                                      })
                                      .join(" ")
                                : "No expression yet"}
                        </Box>
                    </VStack>

                    {/* Display credential citeria */}
                    <VStack align="left">
                        {_credentials &&
                            _credentials.credentials &&
                            _validators.map((validatorIndex, i) =>
                                Object.entries(
                                    validators[validatorIndex].criteriaABI
                                ).map((parameter: any, j) => (
                                    <VStack
                                        align="left"
                                        pt="20px"
                                        key={parameter[0]}
                                    >
                                        {j === 0 && (
                                            <Text>
                                                {`${i + 1}. ${capitalize(
                                                    validators[
                                                        validatorIndex
                                                    ].id
                                                        .replaceAll("_", " ")
                                                        .toLowerCase()
                                                )}`}
                                            </Text>
                                        )}
                                        <Text>
                                            {capitalize(
                                                `${parameter[0]}${
                                                    parameter[1].optional
                                                        ? ""
                                                        : "*"
                                                }`
                                            )}
                                        </Text>

                                        {parameter[1].type === "number" && (
                                            <NumberInput
                                                size="lg"
                                                value={
                                                    _credentials.credentials[i]
                                                        .criteria[parameter[0]]
                                                }
                                                onChange={(value) => {
                                                    const credentialTemp = {
                                                        ..._credentials
                                                    }

                                                    credentialTemp.credentials[
                                                        i
                                                    ].criteria = {
                                                        ..._credentials
                                                            .credentials[i]
                                                            .criteria,
                                                        [parameter[0]]:
                                                            Number(value)
                                                    }

                                                    setCredentials(
                                                        credentialTemp
                                                    )
                                                }}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        )}
                                        {parameter[0] !== "network" &&
                                            parameter[1].type === "string" && (
                                                <Input
                                                    size="lg"
                                                    onChange={(event) => {
                                                        const credentialTemp = {
                                                            ..._credentials
                                                        }

                                                        credentialTemp.credentials[
                                                            i
                                                        ].criteria = {
                                                            ..._credentials
                                                                .credentials[i]
                                                                .criteria,
                                                            [parameter[0]]:
                                                                event.target
                                                                    .value
                                                        }

                                                        setCredentials(
                                                            credentialTemp
                                                        )
                                                    }}
                                                    placeholder={
                                                        parameter[0] ===
                                                        "repository"
                                                            ? "<repo-owner>/<repo-name>"
                                                            : undefined
                                                    }
                                                />
                                            )}
                                        {parameter[0] === "network" &&
                                            parameter[1].type === "string" && (
                                                <Select
                                                    size="lg"
                                                    placeholder="Select network"
                                                    onChange={(event) => {
                                                        const credentialTemp = {
                                                            ..._credentials
                                                        }

                                                        credentialTemp.credentials[
                                                            i
                                                        ].criteria = {
                                                            ..._credentials
                                                                .credentials[i]
                                                                .criteria,
                                                            [parameter[0]]:
                                                                event.target
                                                                    .value
                                                        }

                                                        setCredentials(
                                                            credentialTemp
                                                        )
                                                    }}
                                                >
                                                    {blockchainCredentialSupportedNetworks.map(
                                                        (network: any) => (
                                                            <option
                                                                value={
                                                                    network.name
                                                                }
                                                                key={
                                                                    network.name
                                                                }
                                                            >
                                                                {network.name}
                                                            </option>
                                                        )
                                                    )}
                                                </Select>
                                            )}
                                        {parameter[1].type === "boolean" && (
                                            <Checkbox
                                                isChecked={
                                                    _credentials.credentials[i]
                                                        .criteria[parameter[0]]
                                                }
                                                onChange={(event) => {
                                                    const credentialTemp = {
                                                        ..._credentials
                                                    }

                                                    credentialTemp.credentials[
                                                        i
                                                    ].criteria = {
                                                        ..._credentials
                                                            .credentials[i]
                                                            .criteria,
                                                        [parameter[0]]:
                                                            event.target.checked
                                                    }

                                                    setCredentials(
                                                        credentialTemp
                                                    )
                                                }}
                                            />
                                        )}
                                    </VStack>
                                ))
                            )}
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
                                Object.entries(
                                    validators[_validator].criteriaABI
                                ).some(
                                    ([key, { optional }]: any) =>
                                        !optional &&
                                        (_credentials.criteria[key] ===
                                            undefined ||
                                            !_credentials.criteria[key])
                                )))
                    }
                    variant="solid"
                    colorScheme="primary"
                    onClick={() => {
                        if (_accessMode === "multiple_credentials") {
                            _credentials.expression = _expression.map(
                                (elem) => {
                                    if (!logicalOperators.includes(elem)) {
                                        return ""
                                    }
                                    return elem
                                }
                            )
                            setCredentials(_credentials)
                        }
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
