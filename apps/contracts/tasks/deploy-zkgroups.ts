import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:zkgroups", "Deploy a ZKGroups contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)

    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const ContractFactory = await ethers.getContractFactory("ZKGroups")

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(
                `ZKGroups contract has been deployed to: ${contract.address}`
            )
        }

        return contract
    })
