<P align="center">
    <h1 align="center">
        ZK-Groups contracts
    </h1>
    <p align="center">Zk-groups smart contracts to manage off-chain/on-chain groups and verify their zero-knowledge proofs.</p>
</p>

---

## Install

Install the dependencies:

```bash
cd contracts
npm install
```

### Compile

Compile the smart contracts with Hardhat:

```bash
npm run compile
```

### Testing

Run [Mocha](https://mochajs.org/) to test the contracts:

```bash
npm run test
```

You can also generate a test coverage report:

```bash
npm run test:coverage
```

Or a test gas report:

```bash
npm run test:report-gas
```

### Deploy contracts

Deploy a zk-groups contract with Semaphore-supported networks:

```bash
npm run deploy:goerli
# or
npm run deploy:arbitrum
```

If you want to deploy contracts on Goerli or Arbitrum, remember to provide a valid private key and an Infura API in your `.env` file.
