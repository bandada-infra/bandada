import {
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
    UseDisclosureProps,
    Spinner,
    Text,
    Box
} from "@chakra-ui/react"
import { useState } from "react"
import { semaphore } from "@zk-groups/contract-utils"
import useSigner from "../hooks/useSigner"

export default function AddMemberModal({
    isOpen,
    onClose,
    groupName
}: UseDisclosureProps & any): JSX.Element {
    const [_identityCommitment, setIdentityCommitment] = useState<string>("")
    const [_status, setStatus] = useState<
        "default" | "loading" | "success" | "failure"
    >("default")
    const _signer = useSigner()

    async function addNewMember(groupName: string, identityCommitment: string) {
        if (!identityCommitment) {
            alert("Please enter Identity commitment of the member")
            return
        }
        setStatus("loading")
        try {
            const transaction =
                _signer &&
                (await semaphore.addMember(
                    _signer,
                    groupName,
                    identityCommitment
                ))
            transaction && setStatus("success")
            return
        } catch (error) {
            setStatus("failure")
            console.error(error)
        }
    }

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
                                        addNewMember(
                                            groupName,
                                            _identityCommitment
                                        )
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
