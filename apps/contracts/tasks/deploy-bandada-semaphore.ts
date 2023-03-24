import { Contract } from "ethers"
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

            if (!bandadaAddress) {
                const bandada = await run("deploy:bandada", {
                    logs
                })

                bandadaAddress = bandada.address
            }

            const ContractFactory = await ethers.getContractFactory(
                "BandadaSemaphore"
            )

            const contract = await ContractFactory.deploy(
                semaphoreVerifierAddress,
                bandadaAddress
            )

            await contract.deployed()

            if (logs) {
                console.info(
                    `BandadaSemaphore contract has been deployed to: ${contract.address}`
                )
            }

            return contract
        }
    )
