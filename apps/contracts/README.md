<P align="center">
    <h1 align="center">
        ZK-Groups contracts
    </h1>
    <p align="center">Zk-groups smart contracts to manage off-chain groups and verify their zero-knowledge proofs.</p>
</p>

---

### Install / Compile

`Contracts` is a NX project, and installation/building can be done by running below commands in the project root.

```bash
# in project root
yarn

nx run contracts:build

# or build all projects together
yarn build:all
```

### Testing

Run [Mocha](https://mochajs.org/) to test the contracts:

```bash
# in project root
nx run contracts:test
```

You can also generate a test coverage report:

```bash
# in project root
nx run contracts:coverage
```

Or a test gas report:

```bash
# in project root
REPORT_GAS=true nx run contracts:test
```

### Deploy contracts

Deploy a zk-groups contract with Semaphore-supported networks:

```bash
# in project root
nx run contracts:deploy
# or
nx run contracts:deploy-arbitrum
# or
nx run contracts:deploy-goerli
```

If you want to deploy contracts on Goerli or Arbitrum, remember to provide a valid private key and an Infura API in your `.env` file.
