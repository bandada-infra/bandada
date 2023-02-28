import { Button, Center, Container, Heading } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import usePermissionedGroups from "../hooks/usePermissionedGroups"
import useSigner from "../hooks/useSigner"

export default function PermissionedGroup(): JSX.Element {
    const { account } = useWeb3React<providers.Web3Provider>()
    const { inviteCode } = useParams()
    const [_groupId, setGroupId] = useState<string>()
    const [_groupName, setGroupName] = useState<string>()
    const [_isRedeemed, setIsRedeemed] = useState<boolean>()
    const _signer = useSigner()
    const { getInvite, generateIdentityCommitment, addMember, hasjoined } =
        usePermissionedGroups()
    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            const invite = await getInvite(inviteCode)

            if (invite) {
                setGroupId(invite.groupId)
                setGroupName(invite.groupName)
                setIsRedeemed(invite.redeemed)
            }
        })()
    }, [inviteCode, getInvite])

    useEffect(() => {
        ;(async () => {
            if (!account) {
                console.info("Connect your wallet to join the group")
            }
        })()
    }, [account])

    async function joinGroup() {
        try {
            const identityCommitment =
                _signer &&
                _groupName &&
                _groupId &&
                (await generateIdentityCommitment(
                    _signer,
                    _groupId,
                    _groupName
                ))

            if (hasjoined) {
                alert("You have already joined")
                navigate("/")
                return
            }
            if (_groupName && identityCommitment && inviteCode) {
                addMember(_groupId, identityCommitment, inviteCode)
                navigate("/")
                return
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Container flex="1" mb="80px" mt="300px" px="80px" maxW="container.lg">
            {_isRedeemed === false ? (
                <Center flexDirection="column">
                    <Heading textAlign="center" as="h2" size="xl">
                        You are invited to {_groupName} group
                    </Heading>
                    <Button onClick={() => joinGroup()}>Join Group</Button>
                </Center>
            ) : (
                <Center>
                    <Heading textAlign="center" as="h2" size="xl">
                        This link is expired or invalid.
                    </Heading>
                </Center>
            )}
        </Container>
    )
}
