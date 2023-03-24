import { task, types } from "hardhat/config"

task("deploy:bandada", "Deploy a Bandada contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<any> => {
        const BandadaFactory = await ethers.getContractFactory("Bandada")

        const bandada = await BandadaFactory.deploy()

        await bandada.deployed()

        if (logs) {
            console.info(
                `Bandada contract has been deployed to: ${bandada.address}`
            )
        }

        return bandada
    })
