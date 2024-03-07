import { formatBytes32String } from "@ethersproject/strings"
import { getSemaphoreContract } from "@bandada/utils"
import { Box, Button, Heading, HStack, VStack } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSigner } from "wagmi"
import * as bandadaAPI from "../../api/bandadaAPI"
import image3 from "../../assets/image3.svg"
import GroupCard from "../group-card"

export type FinalPreviewStepProps = {
    group: any
    onBack: () => void
}

export default function FinalPreviewStep({
    group,
    onBack
}: FinalPreviewStepProps): JSX.Element {
    const { data: signer } = useSigner()
    const navigate = useNavigate()
    const [_loading, setLoading] = useState<boolean>()

    const createGroup = useCallback(async () => {
        if (group.type === "on-chain" && signer) {
            setLoading(true)
            try {
                const semaphore = getSemaphoreContract("sepolia", signer as any)
                const admin = await signer.getAddress()

                await semaphore.createGroup(group.name, group.treeDepth, admin)

                const groupId = BigInt(formatBytes32String(group.name))
                navigate(`/groups/on-chain/${groupId}`)
            } catch (error) {
                setLoading(false)
                alert(
                    "Some error occurred! Check if you're on Sepolia network and the transaction is signed and completed"
                )

                console.error(error)
            }
        } else {
            const response = await bandadaAPI.createGroup(
                group.name,
                group.description,
                group.treeDepth,
                group.fingerprintDuration,
                group.credentials
            )

            if (response === null) {
                setLoading(false)
                return
            }
            navigate(`/groups/off-chain/${response.id}`)
        }
    }, [group, signer, navigate])

    return (
        <VStack align="right" w="100%">
            <VStack
                position="relative"
                w="100%"
                h="510px"
                bgImg={`url(${image3})`}
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
                    fontSize="39px"
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

            <HStack justify="right" pt="20px">
                <Button variant="solid" colorScheme="tertiary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    isDisabled={!group.treeDepth}
                    variant="solid"
                    colorScheme="primary"
                    onClick={createGroup}
                    isLoading={_loading}
                >
                    Create group
                </Button>
            </HStack>
        </VStack>
    )
}
