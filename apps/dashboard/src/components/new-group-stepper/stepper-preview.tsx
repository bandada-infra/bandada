import { Box, Heading, VStack } from "@chakra-ui/react"
import image2 from "../../assets/image2.svg"
import GroupCard from "../group-card"

export type StepperPreviewProps = {
    group: any
}

export default function StepperPreview({
    group
}: StepperPreviewProps): JSX.Element {
    return (
        <VStack
            align="left"
            position="relative"
            w="374px"
            h="483px"
            bgImg={`url(${image2})`}
            bgRepeat="no-repeat"
            p="20px"
            borderRadius="8px"
        >
            <Box
                position="absolute"
                h="300px"
                w="100%"
                top="0px"
                left="0px"
                bgGradient="linear(169.41deg, #402A75 3.98%, rgba(220, 189, 238, 0) 65.06%)"
                borderRadius="8px"
            />

            <Heading
                zIndex="1"
                fontSize="25px"
                as="h1"
                color="balticSea.50"
                pb="16px"
            >
                Group preview
            </Heading>

            <Box zIndex="1">
                <GroupCard {...group} />
            </Box>
        </VStack>
    )
}
