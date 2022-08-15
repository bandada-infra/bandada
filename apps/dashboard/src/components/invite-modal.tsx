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
import { useState } from "react"
import { FaRegCopy } from "react-icons/fa"

export default function InviteModal({
    isOpen,
    onClose
}: UseDisclosureProps): JSX.Element {
    const [_inviteLink, setInviteLink] = useState<string>(
        "https://www.zkgroups.com/invite/redeem/YUxc"
    )
    const copyLink = async () => {
        navigator.clipboard.writeText(_inviteLink)
    }

    return (
        <Modal isOpen={!!isOpen} onClose={onClose ? onClose : console.error}>
            <ModalOverlay />
            <ModalContent w="600px">
                <ModalHeader borderBottom="1px" borderColor="gray.200">
                    Generate a unique invitation
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb="10px">
                        <FormLabel>Invite link</FormLabel>
                        <Flex>
                            <InputGroup>
                                <Input value={_inviteLink} fontSize="13px" />
                                <InputRightElement>
                                    <IconButton
                                        aria-label="Copy button"
                                        icon={<FaRegCopy />}
                                        onClick={copyLink}
                                        variant="solid"
                                        h="100%"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <Button
                                variant="solid"
                                colorScheme="primary"
                                ml="10px"
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
