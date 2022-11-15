import { Button, Center, Container, Heading } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import usePermissionedGroups from "src/hooks/usePermissionedGroups"
import useSigner from "src/hooks/useSigner"

export default function PermissionedGroup(): JSX.Element {
    const { account } = useWeb3React<providers.Web3Provider>()
    const { inviteCode } = useParams()
    const [_groupName, setGroupName] = useState<string>()
    const [_isRedeemed, setIsRedeemed] = useState<boolean>()
    const _signer = useSigner()
    const { validateCode, generateIdentityCommitment, addMember, hasjoined } =
        usePermissionedGroups()
    useEffect(() => {
        ;(async () => {
            const codeInfo = await validateCode(inviteCode)
            if (codeInfo) {
                setGroupName(await codeInfo.groupName)
                setIsRedeemed(await codeInfo.redeemed)
            }
        })()
    }, [inviteCode, validateCode])

    useEffect(() => {
        ;(async () => {
            if (!account) {
                console.log("Connect your wallet to join the group")
            }
        })()
    }, [account])

    async function joinGroup() {
        try {
            const identityCommitment =
                _signer &&
                _groupName &&
                (await generateIdentityCommitment(_signer, _groupName))
            if (hasjoined) {
                alert("You have already joined")
                return
            }
            if (_groupName && identityCommitment && inviteCode) {
                addMember(_groupName, identityCommitment, inviteCode)
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
