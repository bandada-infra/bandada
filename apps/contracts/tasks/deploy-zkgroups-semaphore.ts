import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:zkgroups-semaphore", "Deploy a ZKGroupsSemaphore contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .addOptionalParam(
        "zkGroups",
        "ZKGroups contract address",
        undefined,
        types.string
    )
    .addOptionalParam(
        "semaphoreVerifier",
        "SemaphoreVerifier contract address",
        undefined,
        types.string
    )
    .setAction(
        async (
            {
                logs,
                zkGroups: zkGroupsAddress,
                semaphoreVerifier: semaphoreVerifierAddress
            },
            { ethers, run }
        ): Promise<Contract> => {
            if (!semaphoreVerifierAddress) {
                const PairingFactory = await ethers.getContractFactory(
                    "Pairing"
                )
                const pairing = await PairingFactory.deploy()

                await pairing.deployed()

                if (logs) {
                    console.info(
                        `Pairing library has been deployed to: ${pairing.address}`
                    )
                }

                const SemaphoreVerifierFactory =
                    await ethers.getContractFactory("SemaphoreVerifier", {
                        libraries: {
                            Pairing: pairing.address
                        }
                    })

                const semaphoreVerifier =
                    await SemaphoreVerifierFactory.deploy()

                await semaphoreVerifier.deployed()

                if (logs) {
                    console.info(
                        `SemaphoreVerifier contract has been deployed to: ${semaphoreVerifier.address}`
                    )
                }

                semaphoreVerifierAddress = semaphoreVerifier.address
            }

            if (!zkGroupsAddress) {
                const zkGroups = await run("deploy:zkgroups", {
                    logs
                })

                zkGroupsAddress = zkGroups.address
            }

            const ContractFactory = await ethers.getContractFactory(
                "ZKGroupsSemaphore"
            )

            const contract = await ContractFactory.deploy(
                semaphoreVerifierAddress,
                zkGroupsAddress
            )

            await contract.deployed()

            if (logs) {
                console.info(
                    `ZKGroupsSemaphore contract has been deployed to: ${contract.address}`
                )
            }

            return contract
        }
    )
