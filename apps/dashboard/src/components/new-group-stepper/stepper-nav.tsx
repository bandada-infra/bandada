import { HStack, Icon, Text } from "@chakra-ui/react"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"

export type StepperNavProps = {
    index: number
    steps: any[]
    onChange: (index: number) => void
}

export default function StepperNav({
    index,
    steps,
    onChange
}: StepperNavProps): JSX.Element {
    return (
        <HStack w="100%" bg="balticSea.50" p="16px" borderRadius="8px">
            {steps.map((step, i) => (
                <HStack
                    onClick={i < index ? () => onChange(i) : undefined}
                    cursor={i < index ? "pointer" : "inherit"}
                    color={i === index ? "balticSea.800" : "balticSea.500"}
                    key={step}
                >
                    <Text
                        color={i === index ? "balticSea.50" : "balticSea.800"}
                        fontSize="13px"
                        py="4px"
                        px="10px"
                        borderRadius="50px"
                        bgGradient={
                            i === index
                                ? "linear(to-r, sunsetOrange.500, classicRose.600)"
                                : "linear(to-r, balticSea.200, balticSea.200)"
                        }
                    >
                        {i + 1}
                    </Text>
                    <Text>{step}</Text>
                    {i !== steps.length - 1 && (
                        <Icon as={MdOutlineKeyboardArrowRight} boxSize={5} />
                    )}
                </HStack>
            ))}
        </HStack>
    )
}
