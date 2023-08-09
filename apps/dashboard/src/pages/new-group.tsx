import { Container, Heading, HStack, VStack } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AccessModeStep from "../components/new-group-stepper/access-mode-step"
import FinalPreviewStep from "../components/new-group-stepper/final-preview-step"
import GeneralInfoStep from "../components/new-group-stepper/general-info-step"
import GroupSizeStep from "../components/new-group-stepper/group-size-step"
import StepperNav from "../components/new-group-stepper/stepper-nav"
import StepperPreview from "../components/new-group-stepper/stepper-preview"

const steps = ["General info", "Group size", "Access mode", "Summary"]

export default function NewGroupPage(): JSX.Element {
    const [_currentStep, setCurrentStep] = useState<number>(0)
    const [_group, setGroup] = useState<any>({
        type: "off-chain",
        fingerprintDuration: 3600
    })
    const navigate = useNavigate()

    const goToNextStep = useCallback((group?: any, next = true) => {
        if (group) {
            setGroup(group)
        }

        if (next) {
            setCurrentStep((v) => v + 1)
        }
    }, [])

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
                    {(_group.type === "on-chain" && _currentStep !== 2) ||
                    (_group.type === "off-chain" && _currentStep !== 3) ? (
                        <>
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
                                        onSubmit={goToNextStep}
                                        onBack={() => navigate("/groups")}
                                    />
                                ) : _currentStep === 1 ? (
                                    <GroupSizeStep
                                        group={_group}
                                        onSubmit={goToNextStep}
                                        onBack={() => setCurrentStep(0)}
                                    />
                                ) : (
                                    _group.type !== "on-chain" &&
                                    _currentStep === 2 && (
                                        <AccessModeStep
                                            group={_group}
                                            onSubmit={goToNextStep}
                                            onBack={() => setCurrentStep(1)}
                                        />
                                    )
                                )}
                            </VStack>
                        </>
                    ) : (
                        <FinalPreviewStep
                            group={_group}
                            onBack={() => setCurrentStep(_currentStep - 1)}
                        />
                    )}
                </HStack>
            </VStack>
        </Container>
    )
}
