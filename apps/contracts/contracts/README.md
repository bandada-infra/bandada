<P align="center">
    <h1 align="center">
        ZK-Groups contracts
    </h1>
    <p align="center">Zk-groups smart contracts to manage off-chain groups and verify their zero-knowledge proofs.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-groups">
        <img src="https://img.shields.io/badge/project-ZKGroups-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-groups/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-groups.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-groups/contracts">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-groups/contracts?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-groups/contracts">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-groups/contracts.svg?style=flat-square" />
    </a>
</p>

<div align="center">
    <h4>
        <a href="https://github.com/privacy-scaling-explorations/zk-groups/blob/main/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/privacy-scaling-explorations/zk-groups/blob/main/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/privacy-scaling-explorations/zk-groups/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://appliedzkp.org/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-groups/contracts` package with npm:

```bash
npm i @zk-groups/contracts
```

or yarn:

```bash
yarn add @zk-groups/contracts
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

Deploy a zk-groups contract:

```bash
yarn deploy:zkgroups
# or
yarn deploy:zkgroups-semaphore
```

If you want to deploy contracts on Goerli or Arbitrum, remember to provide a valid private key and an Infura API in your `.env` file.
