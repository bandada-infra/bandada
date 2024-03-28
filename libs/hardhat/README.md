<p align="center">
    <h1 align="center">
        Bandada Hardhat plugin
    </h1>
    <p align="center">A Hardhat plugin which provide tasks to deploy Bandada contracts.</p>
</p>

<p align="center">
    <a href="https://github.com/bandada-infra/bandada">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/bandada-infra/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/bandada-infra/bandada.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@bandada/hardhat">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@bandada/hardhat?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@bandada/hardhat">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@bandada/hardhat.svg?style=flat-square" />
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint" />
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier" />
    </a>
</p>

<div align="center">
    <h4>
        <a href="https://github.com/bandada-infra/bandada/blob/main/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/bandada-infra/bandada/blob/main/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/bandada-infra/bandada/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://discord.com/invite/sF5CT5rzrR">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| This Hardhat plugin provides simple tasks that can be used to deploy the Bandada contracts without any additional configuration. |
| -------------------------------------------------------------------------------------------------------------------------------- |

## 🛠 Install

### npm or yarn

Install the `@bandada/hardhat` package with npm:

```bash
npm i @bandada/hardhat
```

or yarn:

```bash
yarn add @bandada/hardhat
```

## 📜 Usage

Import the plugin in your `hardhat.config.ts` file:

```typescript
import "@bandada/hardhat"
import "./tasks/deploy"

const hardhatConfig: HardhatUserConfig = {
    solidity: "0.8.4"
}

export default hardhatConfig
```

And use its tasks to create your own `deploy` task and deploy your contract with a Bandada address.

```typescript
import { task, types } from "hardhat/config"

task("deploy", "Deploy a Greeter contract")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {
        const { bandada } = await run("deploy:bandada", {
            logs
        })

        const Greeter = await ethers.getContractFactory("Greeter")

        const greeter = await Greeter.deploy(bandada.address)

        await greeter.deployed()

        if (logs) {
            console.log(
                `Greeter contract has been deployed to: ${greeter.address}`
            )
        }

        return greeter
    })
```
