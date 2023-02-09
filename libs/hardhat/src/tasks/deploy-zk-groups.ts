import { task, types } from "hardhat/config"

task("deploy:zk-groups", "Deploy a ZKGroups contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<any> => {
        const ZKGroupsFactory = await ethers.getContractFactory("ZKGroups")

        const zkGroups = await ZKGroupsFactory.deploy()

        await zkGroups.deployed()

        if (logs) {
            console.info(
                `ZKGroups contract has been deployed to: ${zkGroups.address}`
            )
        }

        return zkGroups
    })
