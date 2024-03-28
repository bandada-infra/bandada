<P align="center">
    <h1 align="center">
        Bandada contracts
    </h1>
    <p align="center">Bandada smart contracts to manage off-chain groups and verify their zero-knowledge proofs.</p>
</p>

<p align="center">
    <a href="https://github.com/bandada-infra/bandada">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/bandada-infra/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/bandada-infra/bandada.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@bandada/contracts">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@bandada/contracts?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@bandada/contracts">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@bandada/contracts.svg?style=flat-square" />
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

---

## 🛠 Install

### npm or yarn

Install the `@bandada/contracts` package with npm:

```bash
npm i @bandada/contracts
```

or yarn:

```bash
yarn add @bandada/contracts
```

## 📜 Usage

### Compile contracts

Compile the smart contracts with [Hardhat](https://hardhat.org/):

```bash
yarn compile
```

### Testing

Run [Mocha](https://mochajs.org/) to test the contracts:

```bash
yarn test
```

You can also generate a test coverage report:

```bash
yarn test:coverage
```

Or a test gas report:

```bash
yarn test:report-gas
```

### Deploy contracts

Deploy a bandada contract:

```bash
yarn deploy:bandada
# or
yarn deploy:bandada-semaphore
```

If you want to deploy contracts on Sepolia or Arbitrum, remember to provide a valid private key and an Infura API in your `.env` file.
