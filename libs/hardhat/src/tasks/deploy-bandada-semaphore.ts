import { task, types } from "hardhat/config"

task("deploy:bandada-semaphore", "Deploy BandadaSemaphore contract")
    .addOptionalParam<boolean>(
        "pairing",
        "Pairing library address",
        undefined,
        types.string
    )
    .addOptionalParam<boolean>(
        "semaphoreVerifier",
        "SemaphoreVerifier contract address",
        undefined,
        types.string
    )
    .addOptionalParam<boolean>(
        "bandada",
        "Bandada contract address",
        undefined,
        types.string
    )
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(
        async (
            {
                logs,
                pairing: pairingAddress,
                semaphoreVerifier: semaphoreVerifierAddress,
                bandada: bandadaAddress
            },
            { ethers, run }
        ): Promise<any> => {
            if (!semaphoreVerifierAddress) {
                if (!pairingAddress) {
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

                    pairingAddress = pairing.address
                }

                const SemaphoreVerifierFactory =
                    await ethers.getContractFactory("SemaphoreVerifier", {
                        libraries: {
                            Pairing: pairingAddress
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
                const bandada = await run("deploy:bandada", { logs })

                bandadaAddress = bandada.address
            }

            const BandadaSemaphoreFactory = await ethers.getContractFactory(
                "BandadaSemaphore"
            )

            const bandadaSemaphore = await BandadaSemaphoreFactory.deploy(
                semaphoreVerifierAddress,
                bandadaAddress
            )

            await bandadaSemaphore.deployed()

            if (logs) {
                console.info(
                    `BandadaSemaphore contract has been deployed to: ${bandadaSemaphore.address}`
                )
            }

            return bandadaSemaphore
        }
    )
