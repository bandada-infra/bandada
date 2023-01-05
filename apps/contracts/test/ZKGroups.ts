import { resolve } from "path"
import { config as dotenvConfig } from "dotenv"
import { ZKGroups } from "../build/typechain"
import { utils } from "ethers"
import { run } from "hardhat"
import { createIdentityCommitments } from "./utils"
import { Group, Member } from "@semaphore-protocol/group"
import { expect } from "chai"
import { Identity } from "@semaphore-protocol/identity"
import {
    FullProof,
    generateProof,
    packToSolidityProof,
    SolidityProof
} from "@semaphore-protocol/proof"

dotenvConfig({ path: resolve(__dirname, "../../../.env") })

describe("ZKGroups", () => {
    let contract: ZKGroups

    const wasmFilePath = `../../snark-artifacts/semaphore.wasm`
    const zkeyFilePath = `../../snark-artifacts/semaphore.zkey`

    const treeDepth = 20
    const offchainGroupName = utils.formatBytes32String("TestGroupName")
    const group = new Group(treeDepth)
    const members = createIdentityCommitments(3)

    group.addMembers(members)

    before(async () => {
        const { address: verifierAddress } = await run("deploy:verifier", {
            logs: false,
            merkleTreeDepth: treeDepth
        })

        contract = await run("deploy:zk-groups", {
            logs: false,
            verifiers: [
                { merkleTreeDepth: treeDepth, contractAddress: verifierAddress }
            ]
        })
    })

    describe("Off-chain groups", () => {
        describe("# updateOffchainGroup", () => {
            it("Should not publish zk-groups off-chain groups if there is an unsupported merkle tree depth", async () => {
                const transaction = contract.updateOffchainGroups([
                    {
                        name: offchainGroupName,
                        merkleTreeRoot: 123,
                        merkleTreeDepth: 10
                    }
                ])

                await expect(transaction).to.be.revertedWith(
                    "MerkleTreeDepth is not supported"
                )
            })

            it("Should publish zk-groups off-chain groups", async () => {
                const groups: {
                    name: string
                    merkleTreeRoot: Member
                    merkleTreeDepth: number
                }[] = [
                    {
                        name: offchainGroupName,
                        merkleTreeRoot: group.root,
                        merkleTreeDepth: group.depth
                    }
                ]

                const transaction = contract.updateOffchainGroups(groups)

                await expect(transaction)
                    .to.emit(contract, "OffchainGroupUpdated")
                    .withArgs(
                        groups[0].name,
                        groups[0].merkleTreeRoot,
                        groups[0].merkleTreeDepth
                    )
            })
        })

        describe("# getOffchainRoot", () => {
            it("Should get the merkle tree root of an zk-groups off-chain group", async () => {
                const merkleTreeRoot = await contract.getOffchainRoot(
                    offchainGroupName
                )

                expect(merkleTreeRoot).to.equal(
                    "10984560832658664796615188769057321951156990771630419931317114687214058410144"
                )
            })
        })

        describe("# getOffchainDepth", () => {
            it("Should get the merkle tree depth of an zk-groups off-chain group", async () => {
                const merkleTreeDepth = await contract.getOffchainDepth(
                    offchainGroupName
                )

                expect(merkleTreeDepth).to.equal(treeDepth)
            })
        })

        describe("# verifyOffchainGroupProof", () => {
            const signal = utils.formatBytes32String("Hello zk-world")
            const identity = new Identity("0")

            let fullProof: FullProof
            let solidityProof: SolidityProof

            before(async () => {
                fullProof = await generateProof(
                    identity,
                    group,
                    group.root,
                    signal,
                    { wasmFilePath, zkeyFilePath }
                )
                solidityProof = packToSolidityProof(fullProof.proof)
            })

            it("Should not verify a proof if the group does not exist", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    utils.formatBytes32String("1234"),
                    signal,
                    0,
                    0,
                    [0, 0, 0, 0, 0, 0, 0, 0]
                )

                await expect(transaction).to.be.revertedWith(
                    "Offchain group does not exist"
                )
            })

            it("Should throw an exception if the proof is not valid", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    offchainGroupName,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    0,
                    solidityProof
                )

                await expect(transaction).to.be.reverted
            })

            it("Should verify a proof for an off-chain group correctly", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    offchainGroupName,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.merkleRoot,
                    solidityProof
                )

                await expect(transaction)
                    .to.emit(contract, "ProofVerified")
                    .withArgs(
                        offchainGroupName,
                        fullProof.publicSignals.nullifierHash,
                        fullProof.publicSignals.externalNullifier,
                        signal
                    )
            })

            it("Should not verify the same proof for an off-chain group twice", async () => {
                const transaction = contract.verifyOffchainGroupProof(
                    offchainGroupName,
                    signal,
                    fullProof.publicSignals.nullifierHash,
                    fullProof.publicSignals.merkleRoot,
                    solidityProof
                )

                await expect(transaction).to.be.revertedWith(
                    "you cannot use the same nullifier twice"
                )
            })
        })
    })
})
