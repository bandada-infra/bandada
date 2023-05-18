import { getSemaphoreContract } from "@bandada/utils"
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSigner } from "wagmi"
import { createGroup as createOffchainGroup } from "../api/bandadaAPI"
import { groupSizes } from "../data"

export default function CreateGroupModal({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}): JSX.Element {
    const [_step, setStep] = useState<number>(0)
    const [_groupName, setGroupName] = useState<string>("")
    const [_groupType, setGroupType] = useState<string>("")
    const [_groupDescription, setGroupDescription] = useState<string>("")
    const [_groupSize, setGroupSize] = useState<string>("")
    const [_loading, setLoading] = useState<boolean>()
    const { data: signer } = useSigner()

    const nextStep = useCallback(() => {
        setStep(_step + 1)
    }, [setStep, _step])

    const previousStep = useCallback(() => {
        setStep(_step - 1)
    }, [setStep, _step])

    const submitGroupSize = useCallback(() => {
        if (_groupSize) {
            nextStep()
        } else {
            alert("Select the group size")
        }
    }, [_groupSize, nextStep])

    const createGroup = useCallback(
        async (
            name: string,
            type: string,
            description: string,
            treeDepth: number
        ) => {
            if (type === "on-chain" && signer) {
                setLoading(true)
                try {
                    const semaphore = getSemaphoreContract(
                        "goerli",
                        signer as any
                    )
                    const admin = await signer.getAddress()

                    const transaction =
                        signer &&
                        (await semaphore.createGroup(name, treeDepth, admin))

                    setLoading(false)

                    if (transaction) {
                        onClose()
                    }
                } catch (error) {
                    console.error(error)
                    onClose()
                }
            } else {
                await createOffchainGroup(name, description, treeDepth)

                onClose()
            }
        },
        [signer, onClose]
    )

    // eslint-disable-next-line react/no-unstable-nested-components
    function GroupSizeComponent({ size }: { size: string }) {
        return (
            <Flex
                flexDir="column"
                w="280px"
                minH="250px"
                border={
                    _groupSize === size
                        ? "2px solid #373A3E"
                        : "1px solid #D0D1D2"
                }
                borderRadius="4px"
                onClick={() => {
                    setGroupSize(size)
                }}
                cursor="pointer"
            >
                <Box p="15px">
                    <Text fontSize="lg" fontWeight="bold">
                        {size}
                    </Text>
                    <Text color="gray.500">{groupSizes[size].description}</Text>
                    <Text mt="15px">{groupSizes[size].capacity}</Text>
                    <Text mt="15px">Use for</Text>
                    {groupSizes[size].useCases.map((useCase) => (
                        <Text key={useCase}>-{useCase}</Text>
                    ))}
                </Box>
            </Flex>
        )
    }

    useEffect(() => {
        ;(async () => {
            if (!isOpen) {
                setStep(0)
                setGroupName("")
                setGroupType("")
                setGroupDescription("")
                setGroupSize("")
            }
        })()
    }, [isOpen])

    return (
        <Modal isOpen={!!isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW={_step === 1 ? "1200px" : "600px"}>
                <ModalHeader borderBottom="1px" borderColor="gray.200">
                    {_step === 0
                        ? "Create a new group"
                        : _step === 1
                        ? "Choose a group size"
                        : "Review group details"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {_step === 0 ? (
                        <form onSubmit={nextStep}>
                            <VStack spacing="4" mt="2">
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        value={_groupName}
                                        maxLength={32}
                                        onChange={(e) =>
                                            setGroupName(e.target.value)
                                        }
                                        isRequired
                                        placeholder="Group name"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        placeholder="Group type"
                                        onChange={(e) =>
                                            setGroupType(e.target.value as any)
                                        }
                                    >
                                        <option value="on-chain">
                                            On-chain
                                        </option>
                                        <option value="off-chain">
                                            Off-chain
                                        </option>
                                    </Select>
                                </FormControl>
                                {_groupType === "off-chain" && (
                                    <FormControl>
                                        <FormLabel>Description</FormLabel>
                                        <Input
                                            value={_groupDescription}
                                            minLength={10}
                                            isRequired
                                            onChange={(e) =>
                                                setGroupDescription(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter details that will help you differentiate this group"
                                        />
                                    </FormControl>
                                )}
                            </VStack>
                            <Button
                                mt="6"
                                mb="5"
                                type="submit"
                                fontSize="lg"
                                variant="solid"
                                colorScheme="primary"
                            >
                                Continue
                            </Button>
                        </form>
                    ) : _step === 1 ? (
                        <Box>
                            <Flex justifyContent="space-between">
                                <GroupSizeComponent size="small" />
                                <GroupSizeComponent size="medium" />
                                <GroupSizeComponent size="large" />
                                <GroupSizeComponent size="xl" />
                            </Flex>
                            <Text mt="20px" color="#3B3B48" textAlign="center">
                                Group size can be adjusted at any time. To learn
                                how size is calculated, visit our
                                <Link href="./" fontWeight="bold">
                                    {" "}
                                    docs.
                                </Link>
                            </Text>
                            <Flex justifyContent="space-between" mt="20px">
                                <Button onClick={previousStep} fontSize="lg">
                                    Back
                                </Button>
                                <Button
                                    onClick={submitGroupSize}
                                    fontSize="lg"
                                    variant="solid"
                                    colorScheme="primary"
                                >
                                    Continue
                                </Button>
                            </Flex>
                        </Box>
                    ) : (
                        <Box>
                            <Container
                                w="315px"
                                border="1px solid #D0D1D2"
                                mt="20px"
                                pb="20px"
                            >
                                <Flex flexDir="column">
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        mt="15px"
                                    >
                                        {_groupName}
                                    </Text>
                                    <Text mt="15px" color="#75797E">
                                        {_groupSize &&
                                            `${groupSizes[_groupSize].capacity}, Tree depth ${groupSizes[_groupSize].treeDepth}`}
                                    </Text>
                                    <Text mt="20px">{_groupDescription}</Text>
                                    <Text mt="20px">Use for</Text>
                                    {_groupSize &&
                                        groupSizes[_groupSize].useCases.map(
                                            (useCase) => (
                                                <Text key={useCase}>
                                                    -{useCase}
                                                </Text>
                                            )
                                        )}
                                </Flex>
                            </Container>
                            {_loading ? (
                                <Flex
                                    flexDir="column"
                                    alignItems="center"
                                    marginY="20px"
                                    textAlign="center"
                                >
                                    <Spinner size="md" />
                                    <Text mr="5">
                                        Transaction is being executed.
                                    </Text>
                                    <Text mr="5">
                                        It might take a couple of minutes for
                                        the new group to appear on the Groups
                                        list
                                    </Text>
                                </Flex>
                            ) : (
                                <Flex
                                    justifyContent="space-between"
                                    marginY="20px"
                                >
                                    <Button
                                        onClick={previousStep}
                                        fontSize="lg"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        fontSize="lg"
                                        variant="solid"
                                        colorScheme="primary"
                                        onClick={() => {
                                            try {
                                                createGroup(
                                                    _groupName,
                                                    _groupType,
                                                    _groupDescription,
                                                    groupSizes[_groupSize]
                                                        .treeDepth
                                                )
                                            } catch (error) {
                                                console.error(error)
                                            }
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Flex>
                            )}
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
