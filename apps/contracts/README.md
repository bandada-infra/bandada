<P align="center">
    <h1 align="center">
        ZK-Groups contracts
    </h1>
    <p align="center">Zk-groups smart contracts to manage off-chain groups and verify their zero-knowledge proofs.</p>
</p>

---

> **Warning**  
> Run the following commands in the project root!

## 📜 Usage

### Compile contracts

Compile the smart contracts with [Hardhat](https://hardhat.org/):

```bash
yarn build contracts
```

### Testing

Run [Mocha](https://mochajs.org/) to test the contracts:

```bash
yarn test contracts
```

You can also generate a test coverage report:

```bash
nx run contracts:coverage
```

Or a test gas report:

```bash
# in project root
REPORT_GAS=true yarn test contracts
```

### Deploy contracts

Deploy a zk-groups contract with Semaphore-supported networks:

```bash
nx run contracts:deploy
# or
nx run contracts:deploy-arbitrum
# or
nx run contracts:deploy-goerli
```

If you want to deploy contracts on Goerli or Arbitrum, remember to provide a valid private key and an Infura API in your `.env` file.
