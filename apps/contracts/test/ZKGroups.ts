import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import {
    FullProof,
    generateProof,
    packToSolidityProof,
    SolidityProof
} from "@semaphore-protocol/proof"
import { expect } from "chai"
import { BigNumber, utils } from "ethers"
import { run } from "hardhat"
import { ZKGroups } from "../build/typechain"

describe("ZKGroups", () => {
    let contract: ZKGroups

    const groupName = utils.formatBytes32String("Name")
    const identities = [0, 1].map((i) => new Identity(i.toString()))
    const group = new Group(BigNumber.from(groupName).toBigInt(), 20)

    group.addMembers(identities.map(({ commitment }) => commitment))

    before(async () => {
        contract = await run("deploy", {
            logs: false
        })
    })

    describe("# updateGroup", () => {
        it("Should not update groups if there is an unsupported Merkle tree depth", async () => {
            const transaction = contract.updateGroups(
                [groupName],
                [
                    {
                        merkleTreeRoot: 123,
                        merkleTreeDepth: 10
                    }
                ]
            )

            await expect(transaction).to.be.revertedWithCustomError(
                contract,
                "ZKGroups__MerkleTreeDepthIsNotSupported"
            )
        })

        it("Should update groups", async () => {
            const transaction = contract.updateGroups(
                [groupName],
                [
                    {
                        merkleTreeRoot: group.root,
                        merkleTreeDepth: group.depth
                    }
                ]
            )

            await expect(transaction)
                .to.emit(contract, "GroupUpdated")
                .withArgs(groupName, group.root, group.depth)
        })
    })

    describe("# getMerkleTreeRoot", () => {
        it("Should get the Merkle tree root of an off-chain group", async () => {
            const merkleTreeRoot = await contract.getMerkleTreeRoot(groupName)

            expect(merkleTreeRoot).to.equal(group.root)
        })
    })

    describe("# getMerkleTreeDepth", () => {
        it("Should get the Merkle tree depth of an off-chain group", async () => {
            const merkleTreeDepth = await contract.getMerkleTreeDepth(groupName)

            expect(merkleTreeDepth).to.equal(group.depth)
        })
    })

    describe("# verifyProof", () => {
        const wasmFilePath = `../../snark-artifacts/semaphore.wasm`
        const zkeyFilePath = `../../snark-artifacts/semaphore.zkey`

        const signal = utils.formatBytes32String("Hello World")

        let fullProof: FullProof
        let solidityProof: SolidityProof

        before(async () => {
            fullProof = await generateProof(
                identities[0],
                group,
                group.root,
                signal,
                { wasmFilePath, zkeyFilePath }
            )

            solidityProof = packToSolidityProof(fullProof.proof)
        })

        it("Should not verify a proof if the group does not exist", async () => {
            const transaction = contract.verifyProof(
                utils.formatBytes32String("1234"),
                signal,
                0,
                0,
                [0, 0, 0, 0, 0, 0, 0, 0]
            )

            await expect(transaction).to.be.revertedWithCustomError(
                contract,
                "ZKGroups__GroupDoesNotExist"
            )
        })

        it("Should throw an exception if the proof is not valid", async () => {
            const transaction = contract.verifyProof(
                groupName,
                signal,
                fullProof.publicSignals.nullifierHash,
                0,
                solidityProof
            )

            await expect(transaction).to.be.reverted
        })

        it("Should verify a proof for an off-chain group correctly", async () => {
            const transaction = contract.verifyProof(
                groupName,
                signal,
                fullProof.publicSignals.nullifierHash,
                group.root,
                solidityProof
            )

            await expect(transaction)
                .to.emit(contract, "ProofVerified")
                .withArgs(
                    groupName,
                    group.root,
                    fullProof.publicSignals.nullifierHash,
                    group.root,
                    signal
                )
        })

        it("Should not verify the same proof for an off-chain group twice", async () => {
            const transaction = contract.verifyProof(
                groupName,
                signal,
                fullProof.publicSignals.nullifierHash,
                group.root,
                solidityProof
            )

            await expect(transaction).to.be.revertedWithCustomError(
                contract,
                "ZKGroups__YouAreUsingTheSameNillifierTwice"
            )
        })
    })
})
