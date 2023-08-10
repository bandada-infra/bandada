import { getSemaphoreContract } from "@bandada/utils"
import {
    AbsoluteCenter,
    Box,
    Button,
    Divider,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    Tooltip,
    useClipboard
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { FiCopy } from "react-icons/fi"
import { useSigner } from "wagmi"
import * as bandadaAPI from "../api/bandadaAPI"
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
}: AddMemberModalProps): JSX.Element {
    const [_memberId, setMemberId] = useState<string>("")
    const [_isLoading, setIsLoading] = useState(false)
    const {
        hasCopied,
        value: _clientLink,
        setValue: setClientLink,
        onCopy
    } = useClipboard("")
    const { data: signer } = useSigner()

    useEffect(() => {
        setMemberId("")

        if (group.credentials) {
            setClientLink(
                `${import.meta.env.VITE_CLIENT_URL}?credentialGroupId=${
                    group.id
                }`
            )
        }
    }, [group, setClientLink])

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

        setIsLoading(true)

        if (group.type === "off-chain") {
            if ((await bandadaAPI.addMember(group.id, _memberId)) === null) {
                setIsLoading(false)
                return
            }

            setIsLoading(false)
            onClose(_memberId)
        } else {
            if (!signer) {
                alert("No valid signer for your transaction!")

                setIsLoading(false)
                return
            }

            try {
                const semaphore = getSemaphoreContract("goerli", signer as any)

                await semaphore.addMember(group.name, _memberId)

                setIsLoading(false)
                onClose(_memberId)
            } catch (error) {
                alert("Some error occurred!")

                setIsLoading(false)
            }
        }
    }, [onClose, _memberId, group, signer])

    const generateInviteLink = useCallback(async () => {
        const inviteLink = await bandadaAPI.generateMagicLink(group.id)

        if (inviteLink === null) {
            return
        }

        setClientLink(inviteLink)
    }, [group, setClientLink])

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

                    {!group.credentials && (
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
                                isLoading={_isLoading}
                            >
                                Add member
                            </Button>
                        </Box>
                    )}

                    {group.type === "off-chain" && !group.credentials && (
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
                    )}

                    {group.type === "off-chain" && (
                        <Box mb="30px">
                            <Text mb="10px" color="balticSea.800">
                                {!group.credentials
                                    ? "Share invite link"
                                    : "Share access link"}
                            </Text>

                            <InputGroup size="lg">
                                <Input
                                    pr="50px"
                                    placeholder={
                                        !group.credentials
                                            ? "Invite link"
                                            : "Access link"
                                    }
                                    value={_clientLink}
                                    isDisabled
                                />
                                <InputRightElement mr="5px">
                                    <Tooltip
                                        label={hasCopied ? "Copied!" : "Copy"}
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
                                                <Icon
                                                    color="sunsetOrange.600"
                                                    boxSize="5"
                                                    as={FiCopy}
                                                />
                                            }
                                        />
                                    </Tooltip>
                                </InputRightElement>
                            </InputGroup>

                            {!group.credentials && (
                                <Button
                                    mt="10px"
                                    variant="link"
                                    color="balticSea.600"
                                    textDecoration="underline"
                                    onClick={generateInviteLink}
                                >
                                    Generate new link
                                </Button>
                            )}
                        </Box>
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
