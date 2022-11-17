import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    UseDisclosureProps
} from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { FaRegCopy } from "react-icons/fa"
import useInvites from "../hooks/useInvites"

export default function InviteModal({
    isOpen,
    onClose,
    groupName
}: UseDisclosureProps & any): JSX.Element {
    const { generateMagicLink } = useInvites()
    const [_magicLink, setMagicLink] = useState<string>("")

    const copyLink = useCallback(async () => {
        navigator.clipboard.writeText(_magicLink)
    }, [_magicLink])

    return (
        <Modal isOpen={!!isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="600px">
                <ModalHeader borderBottom="1px" borderColor="gray.200">
                    Generate a unique invitation
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl marginY="10px">
                        <FormLabel color="gray.500" fontWeight="700">
                            Invite link
                        </FormLabel>
                        <Flex alignItems="center">
                            <InputGroup>
                                <Input
                                    value={_magicLink}
                                    fontSize="16px"
                                    color="gray.500"
                                    readOnly
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label="Copy button"
                                        icon={<FaRegCopy />}
                                        onClick={copyLink}
                                        variant="link"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <Button
                                variant="solid"
                                colorScheme="primary"
                                ml="10px"
                                onClick={async () =>
                                    setMagicLink(
                                        await generateMagicLink(groupName)
                                    )
                                }
                            >
                                New Link
                            </Button>
                        </Flex>
                    </FormControl>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
