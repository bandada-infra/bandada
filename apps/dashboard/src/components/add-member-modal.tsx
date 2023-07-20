import { getSemaphoreContract } from "@bandada/utils"
import {
    AbsoluteCenter,
    Box,
    Button,
    Divider,
    Heading,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    Tooltip,
    useClipboard,
    UseDisclosureProps
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useSigner } from "wagmi"
import * as bandadaAPI from "../api/bandadaAPI"
import copyIcon from "../assets/copy.svg"
import { Group } from "../types"

export type AddMemberModalProps = {
    isOpen: boolean
    onClose: (value?: string) => void
    group: Group
}

export default function AddMemberModal({
    isOpen,
    onClose,
    group
}: UseDisclosureProps & any): JSX.Element {
    const [_memberId, setMemberId] = useState<string>("")
    const {
        hasCopied,
        value: _inviteLink,
        setValue: setInviteLink,
        onCopy
    } = useClipboard("")
    const { data: signer } = useSigner()

    useEffect(() => {
        setMemberId("")
    }, [isOpen])

    const addMember = useCallback(async () => {
        if (!_memberId) {
            alert("Please enter a member id!")

            return
        }

        if (
            !window.confirm(
                `Hare you sure you want to add member '${_memberId}'?`
            )
        ) {
            return
        }

        if (group.type === "off-chain") {
            if ((await bandadaAPI.addMember(group.id, _memberId)) === null) {
                alert("Some error occurred!")

                return
            }

            onClose(_memberId)
        } else {
            if (!signer) {
                alert("No valid signer for your transaction!")

                return
            }

            try {
                const semaphore = getSemaphoreContract("goerli", signer as any)

                await semaphore.addMember(group.name, _memberId)

                onClose(_memberId)
            } catch (error) {
                alert("Some error occurred!")

                console.error(error)
            }
        }
    }, [onClose, _memberId, group, signer])

    const generateInviteLink = useCallback(async () => {
        const inviteLink = await bandadaAPI.generateMagicLink(group.id)

        if (inviteLink === null) {
            alert("Some error occurred!")

            return
        }

        setInviteLink(inviteLink)
    }, [group, setInviteLink])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            isCentered
        >
            <ModalOverlay />
            <ModalContent bgColor="balticSea.50" maxW="450px">
                <ModalBody p="25px 30px">
                    <Heading fontSize="25px" fontWeight="500" mb="25px" as="h1">
                        New member
                    </Heading>

                    <Box mb="5px">
                        <Text my="10px" color="balticSea.800">
                            Add member ID
                        </Text>

                        <Input
                            placeholder="Paste member ID here"
                            size="lg"
                            value={_memberId}
                            onChange={(event) =>
                                setMemberId(event.target.value)
                            }
                        />

                        <Button
                            my="10px"
                            width="100%"
                            variant="solid"
                            colorScheme="tertiary"
                            onClick={addMember}
                        >
                            Add member
                        </Button>
                    </Box>

                    {group.type === "off-chain" &&
                        !group.reputationCriteria && (
                            <>
                                <Box position="relative" py="8">
                                    <Divider borderColor="balticSea.300" />
                                    <AbsoluteCenter
                                        fontSize="13px"
                                        px="4"
                                        bgColor="balticSea.50"
                                    >
                                        OR
                                    </AbsoluteCenter>
                                </Box>

                                <Box mb="30px">
                                    <Text mb="10px" color="balticSea.800">
                                        Share invite link
                                    </Text>

                                    <InputGroup size="lg">
                                        <Input
                                            pr="50px"
                                            placeholder="Invite link"
                                            value={_inviteLink}
                                            isDisabled
                                        />
                                        <InputRightElement mr="5px">
                                            <Tooltip
                                                label={
                                                    hasCopied
                                                        ? "Copied!"
                                                        : "Copy"
                                                }
                                                closeOnClick={false}
                                                hasArrow
                                            >
                                                <IconButton
                                                    variant="link"
                                                    aria-label="Copy invite link"
                                                    onClick={onCopy}
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    icon={
                                                        <Image src={copyIcon} />
                                                    }
                                                />
                                            </Tooltip>
                                        </InputRightElement>
                                    </InputGroup>

                                    <Button
                                        mt="10px"
                                        variant="link"
                                        color="balticSea.600"
                                        textDecoration="underline"
                                        onClick={generateInviteLink}
                                    >
                                        Generate new link
                                    </Button>
                                </Box>
                            </>
                        )}

                    <Button
                        width="100%"
                        variant="solid"
                        colorScheme="tertiary"
                        onClick={() => onClose()}
                    >
                        Close
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
