<p align="center">
    <h1 align="center">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
      </picture>
      ZK-Groups
    </h1>
</p>

<p align="center">
    <a href="https://github.com/semaphore-protocol" target="_blank">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/zk-groups/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/semaphore-protocol/zk-groups.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/zk-groups/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/semaphore-protocol/zk-groups/test.yml?branch=main&label=test&style=flat-square&logo=github">
    </a>
    <a href="https://github.com/semaphore-protocol/zk-groups/actions?query=workflow%3Astyle">
        <img alt="GitHub Workflow style" src="https://img.shields.io/github/actions/workflow/status/semaphore-protocol/zk-groups/style.yml?branch=main&label=style&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/semaphore-protocol/zk-groups">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/semaphore-protocol/zk-groups?label=coverage (ts)&style=flat-square&logo=coveralls">
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
        <a href="https://github.com/semaphore-protocol/zk-groups/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://t.me/joinchat/B-PQx1U3GtAh--Z4Fwo56A">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| Groups are an important concept when we speak about privacy and zero knowledge technologies. They can be thought of as anonymity sets, and are a way to establish necessary trust between a set of participants while letting users keep control over how their identities are stored and used. Semaphore groups uses incremental binary Merkle trees, Poseidon hashes and Semaphore identity commitments as tree leaves. The goal of this project is to provide a comprehensive infrastructure to allow anyone to create their own groups. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/semaphore-protocol/zk-groups.git
```

and install the dependencies:

```bash
cd zk-groups && yarn
```

## 📜 Usage

### Starting applications

Run the following commands to start the applications:

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

### Testing

Run [Jest](https://jestjs.io/) to test the code with coverage:

```bash
yarn test:all
```

```bash
yarn test <app-name> # For specific apps
```

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
