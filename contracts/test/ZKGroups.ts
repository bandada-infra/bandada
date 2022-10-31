import path, { resolve } from "path"
import { config as dotenvConfig } from "dotenv"
import { Semaphore, ZKGroups } from "../build/typechain"
import { utils, Signer, constants } from "ethers"
import { run } from "hardhat"
import { createOffchainGroupId, createIdentityCommitments } from "./utils"
import { Group, Member } from "@semaphore-protocol/group"
import { expect } from "chai"
import { Identity } from "@semaphore-protocol/identity"
import { FullProof, generateProof, packToSolidityProof, SolidityProof } from "@semaphore-protocol/proof"


dotenvConfig({ path: resolve(__dirname, "../../.env")})

describe("ZKGroups", () => {
    let contract: ZKGroups
    let semaphore: Semaphore
    let signers: Signer[]
    let accounts: string[]

    const wasmFilePath = `../snark-artifacts/semaphore.wasm`
    const zkeyFilePath = `../snark-artifacts/semaphore.zkey`

    const treeDepth = 20
    const offchainGroupName = utils.formatBytes32String("TestGroupName")
    const offchainGroupId = createOffchainGroupId(offchainGroupName)
    const group = new Group(treeDepth)
    const members = createIdentityCommitments(3)

    group.addMembers(members)

    before(async () => {
        const { address: verifierAddress } = await run("deploy:verifier", { logs: false, merkleTreeDepth: treeDepth})
        semaphore = await run("deploy:semaphore", {
            logs: false,
            verifiers: [{ merkleTreeDepth: treeDepth, contractAddress: verifierAddress }]
        })

        contract = await run("deploy:zk-groups", {
            logs: false,
            verifiers: [{ merkleTreeDepth: treeDepth, contractAddress: verifierAddress}],
            semaphore: semaphore.address
        })

        signers = await run("accounts", { logs: false })
        accounts = await Promise.all(signers.map((signer: Signer) => signer.getAddress()))
    })

    describe("Off-chain groups", () => {
        describe("# updateOffchainGroup", () => {
            it("Should not publish zk-groups off-chain groups if there is an unsupported merkle tree depth", async () => { 
                const transaction = contract.updateOffchainGroups(
                    [{name: offchainGroupName, merkleTreeRoot: 123, merkleTreeDepth: 10}]
                )

                await expect(transaction).to.be.revertedWith("MerkleTreeDepth is not supported")
            })

            it("Should publish zk-groups off-chain groups", async () => {
                const groups: {name: string, merkleTreeRoot: Member, merkleTreeDepth: number }[] = [
                    {name: offchainGroupName, merkleTreeRoot: group.root, merkleTreeDepth: group.depth}
                ]

                const transaction = contract.updateOffchainGroups(groups)

                await expect(transaction).to
                    .emit(contract, "OffchainGroupUpdated")
                    .withArgs(offchainGroupId, groups[0].name, groups[0].merkleTreeRoot, groups[0].merkleTreeDepth)
            })
        })

        describe("# getOffchainRoot", () => {
            it("Should get the merkle tree root of an zk-groups off-chain group", async () => {
                const merkleTreeRoot = await contract.getOffchainRoot(offchainGroupId)

                expect(merkleTreeRoot).to.equal("10984560832658664796615188769057321951156990771630419931317114687214058410144")
            })
        })

        describe("# getOffchainDepth", () => {
            it("Should get the merkle tree depth of an zk-groups off-chain group", async () => {
                const merkleTreeDepth = await contract.getOffchainDepth(offchainGroupId)

                expect(merkleTreeDepth).to.equal(treeDepth)
            })
        })

        describe("# verifyOffchainGroupProof", () => {
            const signal = utils.formatBytes32String("Hello zk-world")
            const identity = new Identity("0")

            let fullProof: FullProof
            let solidityProof: SolidityProof

            before(async () => {
                fullProof = await generateProof(identity, group, group.root, signal, { wasmFilePath , zkeyFilePath })
                solidityProof = packToSolidityProof(fullProof.proof)
            })

            it("Should not verify a proof if the group does not exist", async () => {
                const transaction = contract.verifyOffchainGroupProof(1234, signal, 0, 0, [0,0,0,0,0,0,0,0])

                await expect(transaction).to.be.revertedWith("Offchain group does not exist")
            })

            it("Should throw an exception if the proof is not valid", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    offchainGroupId,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    0,
                    solidityProof
                )

                await expect(transaction).to.be.reverted
            })

            it("Should verify a proof for an off-chain group correctly", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    offchainGroupId,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.merkleRoot,
                    solidityProof
                )

                await expect(transaction).to.emit(contract, "ProofVerified").withArgs(
                    offchainGroupId,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.externalNullifier,
                    signal
                    )
            })

            it("Should not verify the same proof for an off-chain group twice", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    offchainGroupId,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.merkleRoot,
                    solidityProof
                )

                await expect(transaction).to.be.revertedWith("you cannot use the same nullifier twice")
            })
        })
    })

    describe("On-chain groups", () => {
        const groupId = 1
        describe("# createOnchainGroup", () => {
            it("Should create a on-chain group if you pass the deployed semaphore contract", async () => {
                const transaction = contract.connect(signers[0]).createOnchainGroup(groupId, treeDepth, 0, accounts[0], 20) //20 seconds

                await expect(transaction).to.emit(semaphore, "GroupCreated").withArgs(groupId, treeDepth, 0)
                await expect(transaction).to.emit(semaphore, "GroupAdminUpdated").withArgs(groupId, constants.AddressZero, contract.address)
                await expect(transaction).to.emit(contract, "OnchainGroupAdminUpdated").withArgs(groupId,constants.AddressZero, accounts[0])
            })
        })

        describe("# updateOnchainGroupAdmin", () => {
            it("Should not update a on-chain group admin if the caller is not the group admin", async () => {
                const transaction = contract.connect(signers[1]).updateOnchainGroupAdmin(groupId, accounts[1])

                await expect(transaction).to.be.revertedWith("Caller is not the onchain group admin")
            })

            it("Should update a on-chain group admin in zk-groups contract", async () => {
                const transaction = contract.connect(signers[0]).updateOnchainGroupAdmin(groupId, accounts[1])

                await expect(transaction).to.emit(contract, "OnchainGroupAdminUpdated").withArgs(groupId, accounts[0], accounts[1])
            })
        })

        describe("# addMember", () => {
            it("Should not add a member if the caller is not the on-chain group admin", async () => {
                const transaction = contract.connect(signers[2]).addMember(groupId, members[0])

                await expect(transaction).to.be.revertedWith("Caller is not the onchain group admin")
            })

            it("Should add a new member in an existing on-chain group if you pass the deployed semaphore contract", async () => {
                const transaction = contract.connect(signers[1]).addMember(groupId, members[0])

                await expect(transaction).to.emit(semaphore, "MemberAdded").withArgs(
                    groupId,
                    0,
                    members[0],
                    "18951329906296061785889394467312334959162736293275411745101070722914184798221"
                )
            })
        })

        describe("# addMembers", () => {
            it("Should add new members to an existing on-chain group if you pass the deployed semaphore contract", async () => {
                const groupId = 2

                await contract.createOnchainGroup(groupId, treeDepth, 0, accounts[0], 20)

                const transaction = contract.connect(signers[0]).addMembers(groupId, members)

                await expect(transaction).to.emit(semaphore, "MemberAdded").withArgs(
                    groupId,
                    2,
                    members[2],
                    group.root
                )
            })
        })

        describe("# updateMember", () => {
            it("Should not update a member if the caller is not the on-chain group admin", async () => {
                const transaction = contract.updateMember(groupId, members[0], members[1], [0,1], [0,1])

                await expect(transaction).to.be.revertedWith("Caller is not the onchain group admin")
            })

            it("Should update a member from an existing on-chain group if you pass the deployed semaphore contract", async () => {
                const groupId = 2
                const newMember = BigInt(123)

                group.updateMember(0, newMember)

                const { siblings, pathIndices, root } = group.generateProofOfMembership(0)

                const transaction = contract.connect(signers[0]).updateMember(groupId, members[0], newMember, siblings, pathIndices)

                await expect(transaction).to.emit(semaphore, "MemberUpdated").withArgs(groupId, 0, members[0], newMember, root)
            })
        })

        describe("# removeMember", () => {
            it("Should not remove a member if the caller is not the on-chain group admin", async () => {
                const transaction = contract.removeMember(groupId, members[0], [0,1], [0,1])

                await expect(transaction).to.be.revertedWith("Caller is not the onchain group admin")
            })

            it("Should remove a member from an existing on-chain group if you pass the deployed semaphore contract", async () => {
                const groupId = 2
                const member = BigInt(123)

                group.removeMember(0)

                const { siblings, pathIndices, root } = group.generateProofOfMembership(0)

                const transaction = contract.connect(signers[0]).removeMember(groupId, member, siblings, pathIndices)

                await expect(transaction).to.emit(semaphore, "MemberRemoved").withArgs(groupId, 0, member, root)
            })
        })

        describe("# verifyOnchainGroupProof", () => {
            const signal = utils.formatBytes32String("Hello zk-world")
            const identity = new Identity("1")

            let fullProof: FullProof
            let solidityProof: SolidityProof

            it("Should verify a proof for an on-chain group correctly if you pass the deployed semaphore contract", async () => {
                const groupId = 2

                fullProof = await generateProof(identity, group, group.root, signal, {
                    wasmFilePath,
                    zkeyFilePath
                })
                solidityProof = packToSolidityProof(fullProof.proof)

                const transaction = contract.verifyOnchainGroupProof(
                    groupId,
                    group.root,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.merkleRoot,
                    solidityProof
                )

                await expect(transaction).to.emit(semaphore, "ProofVerified").withArgs(
                    groupId,
                    group.root,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.externalNullifier,
                    signal
                )
            })
        })
    })
})