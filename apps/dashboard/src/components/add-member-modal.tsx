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
    Text
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
    const [_loading, setLoading] = useState<boolean>()
    const _signer = useSigner()

    async function addNewMember(groupName: string, identityCommitment: string) {
        if (!identityCommitment) {
            alert("Please enter Identity commitment of the member")
            return
        }
        setLoading(true)
        try {
            const transaction =
                _signer &&
                (await semaphore.addMember(
                    _signer,
                    groupName,
                    identityCommitment
                ))
            setLoading(false)
            transaction && onClose && onClose()
            return
        } catch (error) {
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
                    {_loading ? (
                        <Flex
                            flexDir="row"
                            justifyContent="center"
                            marginY="10px"
                        >
                            <Spinner size="md" />
                            <Text ml="5">Pending transaction</Text>
                        </Flex>
                    ) : (
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
                                    placeholder="Give your group a title"
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
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
