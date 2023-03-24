import { task, types } from "hardhat/config"

task("verify:bandada", "Verify a Bandada contract")
    .addParam("address", "Bandada contract address", undefined, types.string)
    .setAction(async ({ address }, { run }): Promise<void> => {
        try {
            await run("verify:verify", {
                address
            })
        } catch (error) {
            console.error(error)
        }
    })
