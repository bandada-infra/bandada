import {
    Button,
    Container,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    Link,
    Text,
    VStack
} from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { providers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { FiGithub } from "react-icons/fi"
import { useSearchParams } from "react-router-dom"
import icon1Image from "../assets/icon1.svg"
import {
    addMemberByInviteCode,
    getGroup,
    getInvite,
    isGroupMember
} from "../utils/api"

const injectedConnector = new InjectedConnector({})

export default function HomePage(): JSX.Element {
    const [_inviteCode, setInviteCode] = useState<string>("")
    const [_credentialGroupId, setCredentialGroupId] = useState<string>("")
    const [_loading, setLoading] = useState<boolean>(false)
    const { activate, active, library, account } =
        useWeb3React<providers.Web3Provider>()
    const [_searchParams] = useSearchParams()

    useEffect(() => {
        ;(async () => {
            if (await injectedConnector.isAuthorized()) {
                await activate(injectedConnector)
            }
        })()
    }, [activate])

    useEffect(() => {
        const inviteCode = _searchParams.get("inviteCode")
        const credentialGroupId = _searchParams.get("credentialGroupId")

        if (inviteCode) {
            setInviteCode(inviteCode)
        } else if (credentialGroupId) {
            setCredentialGroupId(credentialGroupId)
        }
    }, [_searchParams])

    const joinGroupByInvite = useCallback(
        async (inviteCode: string) => {
            if (account && library) {
                setLoading(true)

                const invite = await getInvite(inviteCode)

                if (invite === null) {
                    setLoading(false)
                    return
                }

                const signer = library.getSigner(account)

                const message = `Sign this message to generate your Semaphore identity.`
                const identity = new Identity(await signer.signMessage(message))
                const identityCommitment = identity.getCommitment().toString()

                const hasJoined = await isGroupMember(
                    invite.group.id,
                    identityCommitment
                )

                if (hasJoined === null) {
                    setLoading(false)
                    return
                }

                if (hasJoined) {
                    setLoading(false)
                    alert("You have already joined this group")
                    return
                }

                const response = await addMemberByInviteCode(
                    invite.group.id,
                    identityCommitment,
                    inviteCode
                )

                if (response === null) {
                    setLoading(false)
                    return
                }

                setInviteCode("")
                setLoading(false)
                alert("You have joined the group!")
            }
        },
        [account, library]
    )

    const joinGroupByCredentials = useCallback(
        async (groupId: string) => {
            if (account && library) {
                setLoading(true)

                const group = await getGroup(groupId)

                if (group === null || group.credentials === null) {
                    setLoading(false)
                    return
                }

                const providerName = group.credentials.id
                    .split("_")[0]
                    .toLowerCase()

                const signer = library.getSigner(account)

                const message = `Sign this message to generate your Semaphore identity.`
                const identity = new Identity(await signer.signMessage(message))
                const identityCommitment = identity.getCommitment().toString()

                window.open(
                    `${
                        import.meta.env.VITE_DASHBOARD_URL
                    }/credentials?group=${groupId}&member=${identityCommitment}&provider=${providerName}`
                )

                setLoading(false)
            }
        },
        [account, library]
    )

    return (
        <Container maxW="container.md" pt="20" pb="20" px="8" centerContent>
            <VStack spacing="20" pb="30px" w="100%">
                <HStack mb="60px" justify="space-between" w="100%">
                    <HStack spacing="1">
                        <Image
                            src={icon1Image}
                            htmlWidth="32px"
                            alt="Bandada icon"
                        />
                        <Heading fontSize="22px" as="h1">
                            bandada
                        </Heading>
                    </HStack>

                    <HStack spacing="5">
                        <Link
                            href="https://github.com/bandada-infra/bandada"
                            isExternal
                        >
                            <HStack spacing="1">
                                <Icon boxSize={5} as={FiGithub} />
                                <Text textDecoration="underline">Github</Text>
                            </HStack>
                        </Link>
                    </HStack>
                </HStack>

                <Heading
                    fontSize="40px"
                    as="h1"
                    lineHeight="67px"
                    textAlign="center"
                >
                    Join Bandada groups
                    <br />
                    by invite or credentials
                </Heading>

                {!active ? (
                    <Button
                        colorScheme="secondary"
                        variant="solid"
                        onClick={() => activate(injectedConnector)}
                    >
                        Connect Metamask
                    </Button>
                ) : (
                    <VStack w="400px" spacing="5">
                        <VStack align="left" w="100%">
                            <Text>Invite code</Text>
                            <Input
                                size="lg"
                                value={_inviteCode}
                                placeholder="Paste your code here"
                                onFocus={() => setCredentialGroupId("")}
                                onChange={(event) =>
                                    setInviteCode(event.target.value)
                                }
                            />
                        </VStack>

                        <VStack align="left" w="100%" pb="10px">
                            <Text>Credential group ID</Text>
                            <Input
                                size="lg"
                                value={_credentialGroupId}
                                placeholder="Paste the credential group id here"
                                onFocus={() => setInviteCode("")}
                                onChange={(event) =>
                                    setCredentialGroupId(event.target.value)
                                }
                            />
                        </VStack>

                        <Button
                            width="100%"
                            colorScheme="secondary"
                            variant="solid"
                            onClick={() =>
                                _inviteCode
                                    ? joinGroupByInvite(_inviteCode)
                                    : joinGroupByCredentials(_credentialGroupId)
                            }
                            isDisabled={!_inviteCode && !_credentialGroupId}
                            isLoading={_loading}
                        >
                            Join group
                        </Button>
                    </VStack>
                )}
            </VStack>
        </Container>
    )
}
