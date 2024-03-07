import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-toolbox"
import { config as dotenvConfig } from "dotenv"
import "hardhat-dependency-compiler"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import "solidity-coverage"
import "./tasks/deploy-bandada"
import "./tasks/verify-bandada"
import "./tasks/deploy-bandada-semaphore"
import "./tasks/verify-bandada-semaphore"

dotenvConfig()

function getNetworks(): NetworksUserConfig {
    if (!process.env.BACKEND_PRIVATE_KEY) {
        return {}
    }

    const infuraApiKey = process.env.INFURA_API_KEY
    const accounts = [`0x${process.env.BACKEND_PRIVATE_KEY}`]

    return {
        local: {
            url: "http://localhost:8545",
            chainId: 1337,
            accounts
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
            chainId: 11155111,
            accounts
        },
        arbitrum: {
            url: "https://arb1.arbitrum.io/rpc",
            chainId: 42161,
            accounts
        }
    }
}

const hardhatConfig: HardhatUserConfig = {
    solidity: {
        version: "0.8.4"
    },
    networks: {
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true
        },
        ...getNetworks()
    },
    dependencyCompiler: {
        paths: [
            "@semaphore-protocol/contracts/base/Pairing.sol",
            "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol"
        ]
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        target: "ethers-v5"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
}

export default hardhatConfig
