<p align="center">
    <h1 align="center">
      Bandada
    </h1>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations" target="_blank">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/bandada.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/bandada/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/privacy-scaling-explorations/bandada/test.yml?branch=main&label=test&style=flat-square&logo=github">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/bandada/actions?query=workflow%3Astyle">
        <img alt="GitHub Workflow style" src="https://img.shields.io/github/actions/workflow/status/privacy-scaling-explorations/bandada/style.yml?branch=main&label=style&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/privacy-scaling-explorations/bandada">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/privacy-scaling-explorations/bandada?label=coverage (ts)&style=flat-square&logo=coveralls">
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
        <a href="https://github.com/privacy-scaling-explorations/bandada/contribute">
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

Bandada consists of a back-end to store the groups and provide the [**API**](/apps/api), two front-ends: the [**dashboard**](/apps/dashboard) to manage groups and members and a [**demo**](/apps/client) application to allow end-users to join the groups, and the [**contracts**](/apps/contracts) Additionally, it also provides a set of JavaScript libraries to support developers.

Two types of groups can be created from the dashboard: **manual** or **credential** groups. In the former you can add members by entering IDs directly or by creating invite links, while in the latter you can define credentials that members must prove they have in order to access the group.

Once you create your manual group in the dashboard you can either create an **API key** to add or remove members or use the **invite codes** to add members with the [`@bandada/api-sdk`](/libs/api-sdk) library. Credential groups can instead be accessed by redirecting users to the appropriate page in the dashboard (i.e. `https://bandada.pse.dev/credentials?group=<groupId>&member=<memberId>&provider=<providerName>`).

Bandada also provides a preset of credential **validators** that can, however, be extended with the [`@bandada/credentials`](/libs/credentials) library.

For more information about our applications and libraries, use the links below to go to their specific README files.

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

## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/privacy-scaling-explorations/bandada.git
```

and install the dependencies:

```bash
cd bandada && yarn
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

Bandada requires a SQL database to work, which is used by the `api` application.
Bandada can work with Postgres and SQLite. Other SQL flavors should work but have not been tested yet.
You can pass the connection URL to the database using the environment variable (see below).

### Testing

Run [Jest](https://jestjs.io/) to test the code with coverage:

```bash
yarn test
```

### Running in Docker

You can also run Bandada using Docker by running below command in the project root:

```sh
docker-compose up -d
```

#### Local development

You can start dependencies essential for local development like a local ethereum network (with data persistence) and TheGraph node using the command below:

```sh
docker-compose -f docker-compose.dev.yml up -d
```

The ethereum node (Ganache) will start on port `8545` and will have the following accounts pre-funded with 100 ETH:

```sh
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

This is the same first account generated by Hardhat network as well.

Deploy the contracts to the local network using the below command:

```sh
yarn workspace contracts deploy:bandada-semaphore --network local
```

The addresses of contracts deployed in a fresh local network would be:

```sh
Pairing library has been deployed to:               0x5FbDB2315678afecb367f032d93F642f64180aa3
SemaphoreVerifier contract has been deployed to:    0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Bandada contract has been deployed to:             0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
BandadaSemaphore contract has been deployed to:    0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

These values are set as defaults in `libs/utils/src/contract-addresses.ts`. If you change the contract and deploy again, new address needs to be set here.

To reset the local network or TheGraph node, you can stop the docker containers, and delete the respective folders inside `./.data`.

## Environment variables

Below are the ENV variables used by the `api`:

| Key                   | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| DB_TYPE               | Type of the SQL database - `postgres`/`sqlite`.                          |
| DB_URL                | Connection string for the database. Path to DB file in case of `sqlite`. |
| API_URL               | Public URL of the api.                                                   |
| DASHBOARD_URL         | Public URL of the dashboard.                                             |
| ETHEREUM_NETWORK      | Ethereum network where the contract is deployed.                         |
| IRON_SESSION_PASSWORD | Secret password used for iron-session.                                   |
| INFURA_API_KEY        | API Key for Infura. This is used for executing blockchain transactions.  |
| BACKEND_PRIVATE_KEY   | Ethereum wallet private key used for making blockchain transactions.     |
| SIWE_STATEMENT        | Statement used as a SIWE message.                                        |
| GITHUB_CLIENT_ID      | Github client id used for credential groups.                             |
| GITHUB_CLIENT_SECRET  | Github client secret used for credential groups.                         |
| TWITTER_REDIRECT_URI  | Twitter redirect URL used for credential groups.                         |
| TWITTER_CLIENT_ID     | Twitter client id used for credential groups.                            |
| TWITTER_CLIENT_SECRET | Twitter client secret used for credential groups.                        |

## API

Bandada provides APIs to get groups data and manage group members. You can add or remove members in a group that you are admin of, using the API key.

To enable API access for a group, you can go to the group page in the dashboard, and switch on the "Enable API Access" toggle button. Once the API is enabled, a new API key will be generated for you.

You can disable the API access anytime using the same toggle button.

For a complete list of the endpoints you can use go to https://api.bandada.pse.dev.
