<p align="center">
    <h1 align="center">
      ZK-Groups
    </h1>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations" target="_blank">
        <img src="https://img.shields.io/badge/project-ZKGroups-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-groups/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-groups.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-groups/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/privacy-scaling-explorations/zk-groups/test.yml?branch=main&label=test&style=flat-square&logo=github">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-groups/actions?query=workflow%3Astyle">
        <img alt="GitHub Workflow style" src="https://img.shields.io/github/actions/workflow/status/privacy-scaling-explorations/zk-groups/style.yml?branch=main&label=style&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/privacy-scaling-explorations/zk-groups">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/privacy-scaling-explorations/zk-groups?label=coverage (ts)&style=flat-square&logo=coveralls">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>

</p>

<div align="center">
    <h4>
        <a href="/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/privacy-scaling-explorations/zk-groups/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://discord.gg/sF5CT5rzrR">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| Groups are an important concept when we speak about privacy and zero knowledge technologies. They can be thought of as anonymity sets, and are a way to establish necessary trust between a set of participants. The goal of this project is to provide a comprehensive infrastructure to allow anyone to create and manage their own groups. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

---

## 📦 Packages

<table>
    <th>Package</th>
    <th>Version</th>
    <th>Downloads</th>
    <tbody>
        <tr>
            <td>
                <a href="/libs/hardhat">
                    @zk-groups/hardhat
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-groups/hardhat">
                    <img src="https://img.shields.io/npm/v/@zk-groups/hardhat.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-groups/hardhat">
                    <img src="https://img.shields.io/npm/dm/@zk-groups/hardhat.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/apps/contracts/contracts">
                    @zk-groups/contracts
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-groups/contracts">
                    <img src="https://img.shields.io/npm/v/@zk-groups/contracts.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-groups/contracts">
                    <img src="https://img.shields.io/npm/dm/@zk-groups/contracts.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
    <tbody>
</table>

## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/privacy-scaling-explorations/zk-groups.git
```

and install the dependencies:

```bash
cd zk-groups && yarn
```

## 📜 Usage

### Starting applications

Run the following command to start the applications in a development environment:

```bash
yarn dev
```

or the following command to start the applications in production mode:

```bash
yarn start
```

### Building libraries/applications

Run the following command to build the libraries/applications:

```bash
yarn build
```

A `dist` folder will be created in each library/application.

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

or to automatically format the code:

```bash
yarn prettier:write
```

### Conventional commits

Semaphore uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). A [command line utility](https://github.com/commitizen/cz-cli) to commit using the correct syntax can be used by running:

```bash
yarn commit
```

It will also automatically check that the modified files comply with ESLint and Prettier rules.

### Database

ZKGroups require a SQL database to work, which is used by the `api` application.
ZKGroups can work with Postgres and SQLite. Other SQL flavors should work but are not tested.
You can pass the connection URL to the database using environment variable (see below).

### Testing

Run [Jest](https://jestjs.io/) to test the code with coverage:

```bash
yarn test
```

### Running in Docker

You can also run the entire `zk-groups` using docker by running below command in the project root:

```sh
docker-compose up -d
```

### Local Development

You can start dependencies essential for local development like a local ethereum network (with data persistance) and TheGraph node using the below command:

```sh
docker-compose -f docker-compose.dev.yml up -d
```

The ethereum node (ganache) started on port `8545` will have the following accounts pre-funded with 100 ETH:

```sh
0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
Private Key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

This is the same first account generated by hardhat network as well.

Deploy the contracts to the local network using the below command:

```sh
#PWD /apps/contracts
yarn deploy:zkgroups-semaphore --network local 
```

The addresses of contracts deployed in a fresh local network would be:
```sh
Pairing library has been deployed to:               0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
SemaphoreVerifier contract has been deployed to:    0x5b1869D9A4C187F2EAa108f3062412ecf0526b24
ZKGroups contract has been deployed to:             0xCfEB869F69431e42cdB54A4F4f105C19C080A601
ZKGroupsSemaphore contract has been deployed to:    0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B
```
These values are set as defaults in `libs/utils/src/contract-addresses.ts`. If you change the contract and deploy again, new address need to be set here.
 

To reset the local network or TheGraph node, you can stop the docker containers, and delete the respective folders inside `./.data`.


## Environment Variables

Below are the ENV variables used by the `api`:

| Key                     | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| DB_TYPE                 | Type of the SQL database - `postgres`/`sqlite`.                          |
| DB_URL                  | Connection string for the database. Path to DB file in case of `sqlite`. |
| JWT_SECRET_KEY          | Secret key used for signing JWT auth tokens.                             |
| GITHUB_CLIENT_ID        | Credentials required for sign in with Github.                            |
| GITHUB_CLIENT_SECRET    | Credentials required for sign in with Github.                            |
| TWITTER_CONSUMER_KEY    | Credentials required for sign in with Twitter.                           |
| TWITTER_CONSUMER_SECRET | Credentials required for sign in with Twitter.                           |
| REDDIT_CLIENT_ID        | Credentials required for sign in with Reddit.                            |
| REDDIT_CLIENT_SECRET    | Credentials required for sign in with Reddit.                            |
| INFURA_API_KEY          | API Key for Infura. This is used for executing blockchain transactions.  |
| BACKEND_PRIVATE_KEY     | Ethereum wallet private key used for making blockchain transactions.     |
