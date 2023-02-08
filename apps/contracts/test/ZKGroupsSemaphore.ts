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
import { ZKGroups, ZKGroupsSemaphore } from "../typechain-types"

describe("ZKGroupsSemaphore", () => {
    let zkGroups: ZKGroups
    let zkGroupsSemaphore: ZKGroupsSemaphore

    const groupId = utils.formatBytes32String("Name")
    const identities = [0, 1].map((i) => new Identity(i.toString()))
    const group = new Group(BigNumber.from(groupId).toBigInt(), 20)

    group.addMembers(identities.map(({ commitment }) => commitment))

    before(async () => {
        zkGroups = await run("deploy-zkgroups", {
            logs: false
        })

        zkGroupsSemaphore = await run("deploy-zkgroups-semaphore", {
            logs: false,
            zkGroups: zkGroups.address
        })

        await zkGroups.updateGroups([
            {
                id: groupId,
                fingerprint: group.root
            }
        ])
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

        it("Should throw an exception if the proof is not valid", async () => {
            const transaction = zkGroupsSemaphore.verifyProof(
                groupId,
                group.depth,
                signal,
                fullProof.publicSignals.nullifierHash,
                0,
                solidityProof
            )

            await expect(transaction).to.be.reverted
        })

        it("Should verify a proof for an off-chain group correctly", async () => {
            const transaction = zkGroupsSemaphore.verifyProof(
                groupId,
                group.depth,
                signal,
                fullProof.publicSignals.nullifierHash,
                group.root,
                solidityProof
            )

            await expect(transaction)
                .to.emit(zkGroupsSemaphore, "ProofVerified")
                .withArgs(
                    groupId,
                    group.root,
                    fullProof.publicSignals.nullifierHash,
                    group.root,
                    signal
                )
        })

        it("Should not verify the same proof for an off-chain group twice", async () => {
            const transaction = zkGroupsSemaphore.verifyProof(
                groupId,
                group.depth,
                signal,
                fullProof.publicSignals.nullifierHash,
                group.root,
                solidityProof
            )

            await expect(transaction).to.be.revertedWithCustomError(
                zkGroupsSemaphore,
                "ZKGroupsSemaphore__YouAreUsingTheSameNullifierTwice"
            )
        })
    })
})
