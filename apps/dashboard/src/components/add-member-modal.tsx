import {
    Box,
    Button,
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
    Spinner,
    Text,
    UseDisclosureProps
} from "@chakra-ui/react"
import { getSemaphoreContract } from "@bandada/utils"
import { useCallback, useState } from "react"
import { useSigner } from "wagmi"

export default function AddMemberModal({
    isOpen,
    onClose,
    groupName
}: UseDisclosureProps & any): JSX.Element {
    const [_identityCommitment, setIdentityCommitment] = useState<string>("")
    const [_status, setStatus] = useState<
        "default" | "loading" | "success" | "failure"
    >("default")
    const { data: signer } = useSigner()

    const addMember = useCallback(
        async (identityCommitment: string) => {
            if (!identityCommitment) {
                alert("Please enter Identity commitment of the member")

                return
            }
            setStatus("loading")
            try {
                const semaphore = getSemaphoreContract("goerli", signer as any)

                const transaction =
                    signer &&
                    (await semaphore.addMember(groupName, identityCommitment))

                if (transaction) {
                    setStatus("success")
                }

                return
            } catch (error) {
                setStatus("failure")
                console.error(error)
            }
        },
        [groupName, signer]
    )

    return (
        <Modal isOpen={!!isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="600px">
                <ModalHeader borderBottom="1px" borderColor="gray.200">
                    Add member to onchain group
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {_status === "default" && (
                        <FormControl marginY="10px">
                            <FormLabel color="gray.500" fontWeight="700">
                                Enter Identity Commitment
                            </FormLabel>
                            <Flex alignItems="center">
                                <Input
                                    value={_identityCommitment}
                                    fontSize="16px"
                                    color="gray.500"
                                    onChange={(e) =>
                                        setIdentityCommitment(e.target.value)
                                    }
                                    placeholder="Identity Commitment"
                                />
                                <Button
                                    variant="solid"
                                    colorScheme="primary"
                                    ml="10px"
                                    onClick={() =>
                                        addMember(_identityCommitment)
                                    }
                                >
                                    Add Member
                                </Button>
                            </Flex>
                        </FormControl>
                    )}

                    {_status === "loading" && (
                        <Flex
                            flexDir="row"
                            justifyContent="center"
                            marginY="10px"
                        >
                            <Spinner size="md" />
                            <Text ml="5">Pending transaction</Text>
                        </Flex>
                    )}

                    {_status === "success" && (
                        <Box textAlign="center" margin="0 auto">
                            <Text mb="20px">
                                Member added successfully. It might take a
                                couple of minutes for the new member to appear
                                on the list.
                            </Text>
                            <Button
                                mb="20px"
                                variant="solid"
                                colorScheme="primary"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </Box>
                    )}

                    {_status === "failure" && (
                        <Box textAlign="center" margin="0 auto">
                            <Text mb="20px">
                                Error ocurred while executing the transaction.
                                Please try again later.
                            </Text>
                            <Button
                                mb="20px"
                                variant="solid"
                                colorScheme="primary"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
