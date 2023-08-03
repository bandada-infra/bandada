import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    VStack
} from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AccessModeStep, {
    AccessMode
} from "../components/new-group-stepper/access-mode-step"
import GeneralInfoStep from "../components/new-group-stepper/general-info-step"
import GroupSizeStep from "../components/new-group-stepper/group-size-step"
import StepperNav from "../components/new-group-stepper/stepper-nav"
import StepperPreview from "../components/new-group-stepper/stepper-preview"

const steps = ["General info", "Group size", "Access mode", "Summary"]

export default function NewGroupPage(): JSX.Element {
    const [_currentStep, setCurrentStep] = useState<number>(0)
    const [_group, setGroup] = useState<any>({})
    const [_accessMode, setAccessMode] = useState<AccessMode>()
    const navigate = useNavigate()

    return (
        <Container maxW="container.xl" px="8" pb="20">
            <VStack spacing="9" flex="1">
                <HStack justifyContent="space-between" width="100%">
                    <Heading fontSize="40px" as="h1">
                        Nueva bandada
                    </Heading>
                </HStack>

                <StepperNav
                    index={_currentStep}
                    onChange={setCurrentStep}
                    steps={steps.filter(
                        (_step, i) => _group.type !== "on-chain" || i !== 2
                    )}
                />

                <HStack w="100%" align="start">
                    <StepperPreview group={_group} />

                    <VStack
                        bg="balticSea.50"
                        py="25px"
                        px="35px"
                        borderRadius="8px"
                        flex="1"
                        align="left"
                    >
                        {_currentStep === 0 ? (
                            <GeneralInfoStep
                                group={_group}
                                onChange={setGroup}
                            />
                        ) : _currentStep === 1 ? (
                            <GroupSizeStep group={_group} onChange={setGroup} />
                        ) : _group.type !== "on-chain" && _currentStep === 2 ? (
                            <AccessModeStep
                                accessMode={_accessMode}
                                onChange={setAccessMode}
                            />
                        ) : (
                            <Box>ueo</Box>
                        )}

                        <HStack justify="right" pt="20px">
                            <Button
                                variant="solid"
                                colorScheme="tertiary"
                                onClick={() =>
                                    _currentStep === 0
                                        ? navigate("/groups")
                                        : setCurrentStep(_currentStep - 1)
                                }
                            >
                                {_currentStep === 0 ? "Cancel" : "Back"}
                            </Button>
                            <Button
                                isDisabled={
                                    !_group.name ||
                                    (_group.type === "off-chain" &&
                                        !_group.description) ||
                                    !_group.type ||
                                    (_currentStep === 1 && !_group.treeDepth) ||
                                    (_currentStep === 2 &&
                                        _group.type !== "on-chain" &&
                                        !_accessMode)
                                }
                                variant="solid"
                                colorScheme="primary"
                                onClick={() =>
                                    (_group.type === "on-chain" &&
                                        _currentStep === 2) ||
                                    _currentStep === 3
                                        ? console.log("Hello")
                                        : setCurrentStep(_currentStep + 1)
                                }
                            >
                                {(_group.type === "on-chain" &&
                                    _currentStep === 2) ||
                                _currentStep === 3
                                    ? "Create group"
                                    : "Continue"}
                            </Button>
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
        </Container>
    )
}
