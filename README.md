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

| Groups are an important concept when we speak about privacy and zero knowledge technologies. They can be thought of as anonymity sets, and are a way to establish necessary trust between a set of participants while letting users keep control over how their identities are stored and used. The goal of this project is to provide a comprehensive infrastructure to allow anyone to create and manage their own groups. |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

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

### Starting dev-server

Run the following commands to start the applications in a development server:

```bash
yarn start:all # To start all the applications
```

```bash
yarn start <app-name> # For specific apps
```

### Building applications

Run [Webpack](https://webpack.js.org/) to build the applications:

```bash
yarn build:all
```

```bash
yarn build <app-name> # For specific apps
```

A `dist` folder will be created.

### Starting in production mode

Once applications have been built, you can run the dist files like this:

```bash
[ENV_VARS] node dist/api/main.js  # Start API
```

`dashboard` and `client` are frontend applications can be served using any http server.
Note that you have to redirect all requests to /index.html as they are single page applications.

```bash
npx http-server -p 3001 --proxy http://localhost:3001\? dist/dashboard/ # Run dashboard on port 3001
```

### Database

Zk-groups require a SQL database to work, which used by the `api` application.
Zk-groups could work with Postgres and SQLite. Other SQL flavours should work but are not tested.
You can pass the connection URL to the database using environment variable (see below)

### Testing

Run [Jest](https://jestjs.io/) to test the code with coverage:

```bash
yarn test:all
```

```bash
yarn test <app-name> # For specific apps
```

### Running in Docker

You can also run the entire `zk-groups` using docker by running below command in the project root:

```sh
docker-compose up -d # or docker compose up -d
```

<hr />

## Environment Variables

Below are the ENV variables used by the `api`

| Key                     | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| DB_TYPE                 | Type of the SQL database - `postgres` / `sqlite`                        |
| DB_URL                  | Connection string for the database. Path to DB file in case of `sqlite` |
| JWT_SECRET_KEY          | Secret key used for signing JWT auth tokens                             |
| SESSION_SECRET          | Secret used for maintaining session                                     |
| GITHUB_CLIENT_ID        | Credentials required for sign in with Github                            |
| GITHUB_CLIENT_SECRET    | Credentials required for sign in with Github                            |
| TWITTER_CONSUMER_KEY    | Credentials required for sign in with Twitter                           |
| TWITTER_CONSUMER_SECRET | Credentials required for sign in with Twitter                           |
| REDDIT_CLIENT_ID        | Credentials required for sign in with Reddit                            |
| REDDIT_CLIENT_SECRET    | Credentials required for sign in with Reddit                            |
| INFURA_API_KEY          | API Key for Infura. This is used for executing blockchain transactions  |
| BACKEND_PRIVATE_KEY     | Ethereum wallet private key used for making blockchain transactions     |

<hr />

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint:all
```

```bash
yarn lint <app-name> # For specific apps
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
