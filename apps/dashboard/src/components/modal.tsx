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

export type sizeProps = {
    sizeFor: string
    capacity: string
    useCases: string[]
    treeDepth: number
}

export type GroupProps = {
    name: string
    description: string
    size: string
    info: sizeProps
}

const sizeInfo: Record<string, sizeProps> = {
    small: {
        sizeFor: "For communities, small teams",
        capacity: "Capacity 30 thousand",
        useCases: ["voting", "feedback"],
        treeDepth: 16
    },
    medium: {
        sizeFor: "For cities, large teams",
        capacity: "Capacity 500 thousand",
        useCases: ["voting", "feedback"],
        treeDepth: 20
    },
    large: {
        sizeFor: "For nations",
        capacity: "Capacity 30 Million",
        useCases: ["voting", "feedback"],
        treeDepth: 25
    },
    xl: {
        sizeFor: "For multiple nations, contries",
        capacity: "Capacity 1 Billion",
        useCases: ["voting", "feedback"],
        treeDepth: 30
    }
}

export default function CreatGroupModal({
    isOpen,
    onClose
}: UseDisclosureProps): JSX.Element {
    const [step, setStep] = useState<number>(0)
    const [groupName, setGroupName] = useState<string>()
    const [groupDescription, setGroupDescription] = useState<string>()
    const [groupSize, setGroupSize] = useState<string>("small")
    function nextStep() {
        setStep(step + 1)
    }
    function previousStep() {
        setStep(step - 1)
    }

    function submitGroupInfo() {
        if (groupName && groupDescription) {
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
                <Text>{sizeInfo[prop.size].sizeFor}</Text>
                <Text>{sizeInfo[prop.size].capacity}</Text>
                <Text>Use for</Text>
                {sizeInfo[prop.size].useCases.map((useCase) => {
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
                    {step === 0
                        ? "Create a new group"
                        : step === 1
                        ? "Choose a group size"
                        : "Review group details"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {step === 0 ? (
                        <Flex
                            h="300px"
                            flexDir="column"
                            justifyContent="space-around"
                        >
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={groupName}
                                    onChange={(e) =>
                                        setGroupName(e.target.value)
                                    }
                                    placeholder="Give your group a title"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Input
                                    value={groupDescription}
                                    onChange={(e) =>
                                        setGroupDescription(e.target.value)
                                    }
                                    placeholder="Enter details that will help you differentiate this group"
                                />
                            </FormControl>
                            <Button
                                onClick={submitGroupInfo}
                                fontSize="lg"
                                bgColor="gray.800"
                                color="#FAFBFC"
                                _hover={{ bg: "gray.600" }}
                            >
                                Continue
                            </Button>
                        </Flex>
                    ) : step === 1 ? (
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
                                    bgColor="gray.800"
                                    color="#FAFBFC"
                                    _hover={{ bg: "gray.600" }}
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
                                        {groupName}
                                    </Text>
                                    <Text mt="15px" color="#75797E">
                                        {groupSize &&
                                            sizeInfo[groupSize].capacity +
                                                ", Tree depth " +
                                                sizeInfo[groupSize].treeDepth}
                                    </Text>
                                    <Text mt="20px">{groupDescription}</Text>
                                    <Text mt="20px">Use for</Text>
                                    {groupSize &&
                                        sizeInfo[groupSize].useCases.map(
                                            (useCase) => {
                                                return <Text>-{useCase}</Text>
                                            }
                                        )}

                                    <Button
                                        mt="20px"
                                        mb="20px"
                                        fontSize="lg"
                                        bgColor="gray.800"
                                        color="#FAFBFC"
                                        _hover={{ bg: "gray.600" }}
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
