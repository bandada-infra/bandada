<p align="center">
    <h1 align="center">
      Bandada
    </h1>
</p>

<p align="center">
    <a href="https://github.com/bandada-infra" target="_blank">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/bandada-infra/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/bandada-infra/bandada.svg?style=flat-square">
    </a>
    <a href="https://github.com/bandada-infra/bandada/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/bandada-infra/bandada/test.yml?branch=main&label=test&style=flat-square&logo=github">
    </a>
    <a href="https://github.com/bandada-infra/bandada/actions?query=workflow%3Astyle">
        <img alt="GitHub Workflow style" src="https://img.shields.io/github/actions/workflow/status/bandada-infra/bandada/style.yml?branch=main&label=style&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/bandada-infra/bandada">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/bandada-infra/bandada?label=coverage (ts)&style=flat-square&logo=coveralls">
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
        <a href="https://github.com/bandada-infra/bandada/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://discord.gg/sF5CT5rzrR">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| Bandada is a public good plug-and-play infrastructure that empowers anyone to create and manage privacy-preserving groups of anonymous individuals, without necessitating prior expertise. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

Bandada comprises a versatile back-end, two user-friendly front-ends (the [**dashboard**](/apps/dashboard) to manage groups and members and a [**demo**](/apps/client) application to allow end-users to join the groups), Ethereum [**smart contracts**](/apps/contracts) for proof verification, and a collection of [**JavaScript libraries**](/libs/) for seamless integration. From the Bandada dashboard, you can effortlessly create two types of groups: **manual** and **credential** groups. In manual groups, you can add members directly or generate invite links while, in credential groups, members must demonstrate their credentials for access. Bandada provides developers with JavaScript libraries, including [`@bandada/api-sdk`](/libs/api-sdk/) to make it easier to work with the APIs. Furthermore, it provides preconfigured credential validators and allows for additional functionality through the [`@bandada/credentials`](/libs/credentials/) library. This feature allows for manual or automated management of both off-chain and on-chain groups by specifying eligibility criteria. It can be used for a variety of applications, such as organizing private organizational members, grouping contributors of a particular GitHub repository, or uniting holders of a specific NFT, among others.

Please see the latest [documentation](https://pse-team.notion.site/Bandada-82d0d9d3c6b64b7bb2a09d4c7647c083) to learn more about Bandada.

## ⚙️ Applications

-   API: [/apps/api](/apps/api)
-   Dashboard: [/apps/dashboard](/apps/dashboard)
-   Demo: [/apps/client](/apps/client)
-   Contracts: [/apps/contracts](/apps/contracts)

## 📦 Libraries

<table>
    <th>Package</th>
    <th>Version</th>
    <th>Downloads</th>
    <tbody>
        <tr>
            <td>
                <a href="/libs/hardhat">
                    @bandada/hardhat
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@bandada/hardhat">
                    <img src="https://img.shields.io/npm/v/@bandada/hardhat.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@bandada/hardhat">
                    <img src="https://img.shields.io/npm/dm/@bandada/hardhat.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/apps/contracts/contracts">
                    @bandada/contracts
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@bandada/contracts">
                    <img src="https://img.shields.io/npm/v/@bandada/contracts.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@bandada/contracts">
                    <img src="https://img.shields.io/npm/dm/@bandada/contracts.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/libs/utils">
                    @bandada/utils
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@bandada/utils">
                    <img src="https://img.shields.io/npm/v/@bandada/utils.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@bandada/utils">
                    <img src="https://img.shields.io/npm/dm/@bandada/utils.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/libs/credentials">
                    @bandada/credentials
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@bandada/credentials">
                    <img src="https://img.shields.io/npm/v/@bandada/credentials.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@bandada/credentials">
                    <img src="https://img.shields.io/npm/dm/@bandada/credentials.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/libs/api-sdk">
                    @bandada/api-sdk
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@bandada/api-sdk">
                    <img src="https://img.shields.io/npm/v/@bandada/api-sdk.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@bandada/api-sdk">
                    <img src="https://img.shields.io/npm/dm/@bandada/api-sdk.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
        </tr>
    <tbody>
</table>

## 🔧 Configuration

### Prerequisites

-   [NodeJS](https://nodejs.org/en) >= v18.17.0

Each package and application brings its own set of environment variables. To getting started with Bandada, you can get rid of the configuration and just use the default settings. Copy the environment variables used by the [`api`](/apps/api/) application by running this command:

```bash
cp apps/api/.env.example apps/api/.env
```

**NB.** Bandada requires an SQL database (see [`api`](/apps/api/) application for usage). Currently, [PostgreSQL](https://www.postgresql.org/) and [SQLite](https://www.sqlite.org/index.html) (default) has been successfully tested (watch out that others SQL flavors may work but have not been tested). We are assuming you are using SQLite as the database.

The applications will be deployed at the following URLs without any changes to the default configurations:

| App                | Development           | Production                     | Staging                                |
| ------------------ | --------------------- | ------------------------------ | -------------------------------------- |
| Bandada API        | http://localhost:3000 | https://api.bandada.pse.dev    | https://api-staging.bandada.pse.dev    |
| Bandada Dashboard  | http://localhost:3001 | https://bandada.pse.dev        | https://staging.bandada.pse.dev        |
| Bandada Client App | http://localhost:3002 | https://client.bandada.pse.dev | https://client-staging.bandada.pse.dev |

## 🛠 Installation

Clone this repository:

```bash
git clone https://github.com/bandada-infra/bandada.git
```

and install the dependencies:

```bash
cd bandada && yarn
```

## 📜 Usage

To build the applications, libraries and compile the contracts, run the following command:

```bash
yarn build
```

A `dist` folder will be created in each library/application.

To start the applications in a development environment, run the following command:

```bash
yarn dev
```

Use the following command to start the applications in the production environment:

```bash
yarn start
```

### Testing

Run [Jest](https://jestjs.io/) to test the code with coverage:

```bash
yarn test
```

## 🐳 Running in Docker

### Prerequisites

-   [Docker](https://www.docker.com/) >= 4.26.1
-   [docker-compose](https://docs.docker.com/compose/) >= 2.24.2

To run Bandada using [Docker](https://www.docker.com/), execute the following command in the project root:

```sh
docker-compose up -d
```

### Local Development

To begin local development, use the following command to start essential dependencies such as a local Ethereum network (with data persistence) and [TheGraph](https://thegraph.com/) node:

```sh
docker-compose -f docker-compose.dev.yml up -d
```

The Ethereum node ([Ganache](https://trufflesuite.com/ganache/)) will run on port `8545` with accounts pre-funded with 100 ETH:

```sh
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# this is the same first account generated by Hardhat network as well.
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

To deploy the contracts to the local network, use the command below:

```sh
yarn workspace contracts deploy:bandada-semaphore --network local
```

The contract addresses deployed in a new local network are:

```sh
Pairing library has been deployed to:               0x5FbDB2315678afecb367f032d93F642f64180aa3
SemaphoreVerifier contract has been deployed to:    0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Bandada contract has been deployed to:             0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
BandadaSemaphore contract has been deployed to:    0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

Default values for contract addresses are set in `libs/utils/src/contract-addresses.ts`. If you make changes to the contract and redeploy, you will need to update the address here.

To reset the local network or TheGraph node, stop the docker containers and delete the corresponding folders inside `./.data`.

## 📡 Enable API Access for a Group

Bandada offers APIs for retrieving group data and managing group members. As an admin of a manual or invitation group, you can use the API key to add or remove members.

To enable API access for a group, go to the group page in the dashboard and toggle the **Enable API Access** button. Once enabled, a new API key will be generated for you. You can disable API access at any time using the same toggle button.

[Enable API access toggle for off-chain group](https://github.com/bandada-infra/bandada/assets/20580910/e7106f24-39c8-422d-97a5-11756200ae03)

## 🔌 APIs endpoints

To see the complete list of available endpoints, please visit https://api.bandada.pse.dev.

## 👨‍💻 Contributing

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

or to format the code automatically:

```bash
yarn prettier:write
```

### Conventional commits

Bandada utilises [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), which follow a standardised format for commit messages. To use this format, you can run the [command line utility](https://github.com/commitizen/cz-cli) by running:

```bash
yarn commit
```

The command will automatically verify that the modified files adhere to the rules of ESLint and Prettier.
