import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    UseDisclosureProps
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { groupSizeInfo } from "src/types/groups"
import useGroups from "src/hooks/useGroups"

export default function CreatGroupModal({
    isOpen,
    onClose
}: UseDisclosureProps): JSX.Element {
    const [_step, setStep] = useState<number>(0)
    const [_groupName, setGroupName] = useState<string>()
    const [_groupDescription, setGroupDescription] = useState<string>()
    const [_groupSize, setGroupSize] = useState<string>("small")
    const { createGroup } = useGroups()

    function nextStep() {
        setStep(_step + 1)
    }
    function previousStep() {
        setStep(_step - 1)
    }

    function submitGroupInfo() {
        if (_groupName && _groupDescription) {
            nextStep()
        } else {
            alert("Please fill out the Name and Description")
        }
    }

    function GroupSizeComponent(prop: { size: string }) {
        return (
            <Flex
                flexDir="column"
                w="315px"
                h="340px"
                border="1px solid #D0D1D2"
                onClick={() => {
                    setGroupSize(prop.size)
                }}
                cursor="pointer"
            >
                <Text>{prop.size}</Text>
                <Text>{groupSizeInfo[prop.size].sizeFor}</Text>
                <Text>{groupSizeInfo[prop.size].capacity}</Text>
                <Text>Use for</Text>
                {groupSizeInfo[prop.size].useCases.map((useCase) => {
                    return <Text>-{useCase}</Text>
                })}
            </Flex>
        )
    }

    useEffect(() => {
        ;(async () => {
            if (!isOpen) {
                setStep(0)
                setGroupName(undefined)
                setGroupDescription(undefined)
                setGroupSize("small")
            }
        })()
    }, [isOpen])

    return (
        <Modal isOpen={!!isOpen} onClose={onClose ? onClose : console.error}>
            <ModalOverlay />
            <ModalContent w="600px">
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
                        <Flex
                            h="300px"
                            flexDir="column"
                            justifyContent="space-around"
                        >
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={_groupName}
                                    onChange={(e) =>
                                        setGroupName(e.target.value)
                                    }
                                    placeholder="Give your group a title"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Input
                                    value={_groupDescription}
                                    onChange={(e) =>
                                        setGroupDescription(e.target.value)
                                    }
                                    placeholder="Enter details that will help you differentiate this group"
                                />
                            </FormControl>
                            <Button
                                onClick={submitGroupInfo}
                                fontSize="lg"
                                variant="solid"
                                colorScheme="primary"
                            >
                                Continue
                            </Button>
                        </Flex>
                    ) : _step === 1 ? (
                        <Box>
                            <Flex>
                                <GroupSizeComponent size="small" />
                                <GroupSizeComponent size="medium" />
                                <GroupSizeComponent size="large" />
                                <GroupSizeComponent size="xl" />
                            </Flex>
                            <Text mt="20px">
                                Group size can be adjusted at any time. To learn
                                how size is calculated, visit our docs.
                            </Text>
                            <Flex justifyContent="space-between" mt="20px">
                                <Button onClick={previousStep} fontSize="lg">
                                    Back
                                </Button>
                                <Button
                                    onClick={nextStep}
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
                            <Container w="315px" border="1px solid #D0D1D2">
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
                                            groupSizeInfo[_groupSize].capacity +
                                                ", Tree depth " +
                                                groupSizeInfo[_groupSize]
                                                    .treeDepth}
                                    </Text>
                                    <Text mt="20px">{_groupDescription}</Text>
                                    <Text mt="20px">Use for</Text>
                                    {_groupSize &&
                                        groupSizeInfo[_groupSize].useCases.map(
                                            (useCase) => {
                                                return <Text>-{useCase}</Text>
                                            }
                                        )}

                                    <Button
                                        mt="20px"
                                        mb="20px"
                                        fontSize="lg"
                                        variant="solid"
                                        colorScheme="primary"
                                        onClick={() => {
                                            if (
                                                _groupName &&
                                                _groupDescription &&
                                                onClose
                                            ) {
                                                createGroup(
                                                    _groupName,
                                                    _groupDescription,
                                                    _groupSize
                                                )
                                                onClose()
                                            }
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Flex>
                            </Container>
                            <Flex justifyContent="space-between" mt="20px">
                                <Button onClick={previousStep} fontSize="lg">
                                    Back
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </Flex>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
