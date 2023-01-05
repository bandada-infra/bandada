import { Contract } from "ethers"
import { task, types } from "hardhat/config"
import {
    getDeployedContracts,
    verifiersToSolidityArgument
} from "../scripts/utils"

task("deploy:zk-groups", "Deploy a zk-groups contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .addOptionalParam(
        "verifiers",
        "Tree depths and verifier addresses",
        [],
        types.json
    )
    .setAction(
        async (
            { logs, verifiers },
            { ethers, hardhatArguments }
        ): Promise<Contract> => {
            let deployedContracts: any = getDeployedContracts(
                hardhatArguments.network
            )

            if (verifiers.length === 0) {
                verifiers = verifiersToSolidityArgument(deployedContracts)
            }

            const ContractFactory = await ethers.getContractFactory("ZKGroups")

            const contract = await ContractFactory.deploy(verifiers)

            await contract.deployed()

            if (logs) {
                console.info(
                    `ZKGroups contract has been deployed to: ${contract.address}`
                )
            }

            return contract
        }
    )
