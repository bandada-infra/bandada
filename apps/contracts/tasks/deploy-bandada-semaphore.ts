import type { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:bandada-semaphore", "Deploy a BandadaSemaphore contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .addOptionalParam(
        "bandada",
        "Bandada contract address",
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
                bandada: bandadaAddress,
                semaphoreVerifier: semaphoreVerifierAddress
            },
            { ethers, run }
        ): Promise<Contract> => {
            if (!semaphoreVerifierAddress) {
                const PairingFactory = await ethers.getContractFactory(
                    "Pairing"
                )
                const pairing = await PairingFactory.deploy()

                await pairing.waitForDeployment()

                if (logs) {
                    console.info(
                        `Pairing library has been deployed to: ${pairing.getAddress()}`
                    )
                }

                const SemaphoreVerifierFactory =
                    await ethers.getContractFactory("SemaphoreVerifier", {
                        libraries: {
                            Pairing: await pairing.getAddress()
                        }
                    })

                const semaphoreVerifier =
                    await SemaphoreVerifierFactory.deploy()

                await semaphoreVerifier.waitForDeployment()

                if (logs) {
                    console.info(
                        `SemaphoreVerifier contract has been deployed to: ${semaphoreVerifier.getAddress()}`
                    )
                }

                semaphoreVerifierAddress = await semaphoreVerifier.getAddress()
            }

            if (!bandadaAddress) {
                const bandada = await run("deploy:bandada", {
                    logs
                })

                bandadaAddress = await bandada.getAddress()
            }

            const ContractFactory = await ethers.getContractFactory(
                "BandadaSemaphore"
            )

            const contract = await ContractFactory.deploy(
                semaphoreVerifierAddress,
                bandadaAddress
            )

            await contract.waitForDeployment()

            if (logs) {
                console.info(
                    `BandadaSemaphore contract has been deployed to: ${contract.getAddress()}`
                )
            }

            return contract
        }
    )
