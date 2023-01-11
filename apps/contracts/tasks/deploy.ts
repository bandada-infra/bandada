import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy", "Deploy a ZKGroups contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .addOptionalParam(
        "semaphoreVerifier",
        "SemaphoreVerifier contract address",
        undefined,
        types.string
    )
    .setAction(
        async (
            { logs, semaphoreVerifier: semaphoreVerifierAddress },
            { ethers }
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

            const ContractFactory = await ethers.getContractFactory("ZKGroups")

            const contract = await ContractFactory.deploy(
                semaphoreVerifierAddress
            )

            await contract.deployed()

            if (logs) {
                console.info(
                    `ZKGroups contract has been deployed to: ${contract.address}`
                )
            }

            return contract
        }
    )
