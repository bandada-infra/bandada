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
    Textarea,
    Tooltip,
    useClipboard
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { FiCopy } from "react-icons/fi"
import { useSigner } from "wagmi"
import * as bandadaAPI from "../api/bandadaAPI"
import { Group } from "../types"
import parseMemberIds from "../utils/parseMemberIds"

export type AddMemberModalProps = {
    isOpen: boolean
    onClose: (value?: string[]) => void
    group: Group
}

export default function AddMemberModal({
    isOpen,
    onClose,
    group
}: AddMemberModalProps): JSX.Element {
    const [_memberIds, setMemberIds] = useState<string>("")
    const [_isLoading, setIsLoading] = useState(false)
    const {
        hasCopied,
        value: _clientLink,
        setValue: setClientLink,
        onCopy
    } = useClipboard("")
    const { data: signer } = useSigner()

    useEffect(() => {
        setMemberIds("")

        if (group.credentials) {
            setClientLink(
                `${import.meta.env.VITE_CLIENT_URL}?credentialGroupId=${
                    group.id
                }`
            )
        }
    }, [group, setClientLink])

    const addMember = useCallback(async () => {
        const memberIds = parseMemberIds(_memberIds)
        if (memberIds.length === 0) {
            alert("Please enter at least one member id!")
            return
        }

        const uniqueMemberIds = new Set(memberIds)
        if (uniqueMemberIds.size !== memberIds.length) {
            alert("Please ensure there are no repeated member IDs!")
            return
        }
        if (group.type === "on-chain" && group.members) {
            const existingMembers = new Set(
                group.members.map((memberId) => BigInt(memberId))
            )

            const conflictingMembers = []

            for (const memberId of memberIds) {
                const parsedMemberId = BigInt(memberId)

                if (existingMembers.has(parsedMemberId)) {
                    conflictingMembers.push(parsedMemberId)
                }
            }

            if (conflictingMembers.length > 0) {
                if (conflictingMembers.length === 1) {
                    alert(
                        `Member ID ${conflictingMembers[0]} already exists in the group.`
                    )
                } else {
                    alert(
                        `Member IDs ${conflictingMembers.join(
                            ", "
                        )} already exist in the group.`
                    )
                }
                return
            }
        }

        const confirmMessage = `
Are you sure you want to add the following members?
${memberIds.join("\n")}
        `

        if (!window.confirm(confirmMessage)) {
            return
        }

        setIsLoading(true)

        if (group.type === "off-chain") {
            if ((await bandadaAPI.addMembers(group.id, memberIds)) === null) {
                setIsLoading(false)
                return
            }

            setIsLoading(false)
            onClose(memberIds)
        } else {
            if (!signer) {
                alert("No valid signer for your transaction!")

                setIsLoading(false)
                return
            }

            try {
                const semaphore = getSemaphoreContract("sepolia", signer as any)

                await semaphore.addMembers(group.name, memberIds)

                setIsLoading(false)
                onClose(memberIds)
            } catch (error) {
                alert(
                    "Some error occurred! Check if you're on Sepolia network and the transaction is signed and completed"
                )

                setIsLoading(false)
            }
        }
    }, [onClose, _memberIds, group, signer])

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
                                Add member IDs
                            </Text>

                            <Textarea
                                placeholder="Paste one or more member IDs separated by commas, spaces, or newlines"
                                size="lg"
                                value={_memberIds}
                                onChange={(event) =>
                                    setMemberIds(event.target.value)
                                }
                                rows={5}
                            />

                            <Button
                                my="10px"
                                width="100%"
                                variant="solid"
                                colorScheme="tertiary"
                                onClick={addMember}
                                isLoading={_isLoading}
                            >
                                Add members
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
