import { task, types } from "hardhat/config"

task("verify:bandada-semaphore", "Verify a BandadaSemaphore contract")
    .addParam(
        "address",
        "BandadaSemaphore contract address",
        undefined,
        types.string
    )
    .addParam(
        "args",
        "BandadaSemaphore constructor arguments",
        undefined,
        types.json
    )
    .setAction(async ({ address, args }, { run }): Promise<void> => {
        try {
            await run("verify:verify", {
                address,
                constructorArguments: args
            })
        } catch (error) {
            console.error(error)
        }
    })
