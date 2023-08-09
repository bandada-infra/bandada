import { request } from "@bandada/utils"
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

const injectedConnector = new InjectedConnector({})

export default function HomePage(): JSX.Element {
    const [_inviteCode, setInviteCode] = useState<string>("")
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

        if (inviteCode) {
            setInviteCode(inviteCode)
        }
    }, [_searchParams])

    const joinGroupByInvite = useCallback(
        async (inviteCode: string) => {
            if (account && library) {
                setLoading(true)

                const invite = await request(
                    `${import.meta.env.VITE_API_URL}/invites/${inviteCode}`
                )

                if (!invite) {
                    alert("Some error occurred!")
                    setLoading(false)
                    return
                }

                const signer = library.getSigner(account)

                const message = `Sign this message to generate your Semaphore identity.`
                const identity = new Identity(await signer.signMessage(message))
                const identityCommitment = identity.getCommitment().toString()
                const hasJoined = await request(
                    `${import.meta.env.VITE_API_URL}/groups/${
                        invite.groupId
                    }/members/${identityCommitment}`
                )

                if (hasJoined) {
                    alert("You have already joined this group")
                    setLoading(false)
                    return
                }

                await request(
                    `${import.meta.env.VITE_API_URL}/groups/${
                        invite.groupId
                    }/members/${identityCommitment}`,
                    {
                        method: "post",
                        data: {
                            inviteCode
                        }
                    }
                )

                alert("You have joined the group!")
                setInviteCode("")
                setLoading(false)
            }
        },
        [account, library]
    )

    return (
        <Container maxW="container.xl" pt="20" pb="20" px="8" centerContent>
            <VStack spacing="20" pb="30px">
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
                            href="https://github.com/privacy-scaling-explorations/bandada"
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
                    by invite .
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
                                onChange={(event) =>
                                    setInviteCode(event.target.value)
                                }
                            />
                        </VStack>

                        <Button
                            width="100%"
                            colorScheme="secondary"
                            variant="solid"
                            onClick={() => joinGroupByInvite(_inviteCode)}
                            isDisabled={!_inviteCode}
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
