import { extendConfig } from "hardhat/config"
import { HardhatConfig, HardhatUserConfig } from "hardhat/types"

import "hardhat-dependency-compiler"
import "@nomiclabs/hardhat-ethers"
import "./tasks/deploy-bandada"
import "./tasks/deploy-bandada-semaphore"

extendConfig(
    (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
        config.dependencyCompiler.paths = [
            "@zk-groups/contracts/Bandada.sol",
            "@zk-groups/contracts/protocols/BandadaSemaphore.sol",
            "@semaphore-protocol/contracts/base/Pairing.sol",
            "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol"
        ]

        if (userConfig.dependencyCompiler?.paths) {
            config.dependencyCompiler.paths = [
                ...config.dependencyCompiler.paths,
                ...userConfig.dependencyCompiler.paths
            ]
        }
    }
)
