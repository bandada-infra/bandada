import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { expect } from "chai"
import { BigNumber, utils } from "ethers"
import { run } from "hardhat"
import { ZKGroups } from "../typechain-types"

describe("ZKGroups", () => {
    let zkGroups: ZKGroups

    const groupId = utils.formatBytes32String("Name")
    const identities = [0, 1].map((i) => new Identity(i.toString()))
    const group = new Group(BigNumber.from(groupId).toBigInt(), 20)

    group.addMembers(identities.map(({ commitment }) => commitment))

    before(async () => {
        zkGroups = await run("deploy-zkgroups", {
            logs: false
        })
    })

    describe("# updateGroup", () => {
        it("Should update groups", async () => {
            const transaction = zkGroups.updateGroups([
                {
                    id: groupId,
                    fingerprint: group.root
                }
            ])

            await expect(transaction)
                .to.emit(zkGroups, "GroupUpdated")
                .withArgs(groupId, group.root)
        })
    })

    describe("# groups", () => {
        it("Should get the current fingerprint of an off-chain group", async () => {
            const fingerprint = await zkGroups.groups(groupId)

            expect(fingerprint).to.equal(group.root)
        })
    })
})
