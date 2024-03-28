<p align="center">
    <h1 align="center">
        Bandada credentials
    </h1>
    <p align="center">Bandada library to validate users' credentials.</p>
</p>

<p align="center">
    <a href="https://github.com/bandada-infra/bandada">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/bandada-infra/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/bandada-infra/bandada.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@bandada/credentials">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@bandada/credentials?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@bandada/credentials">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@bandada/credentials.svg?style=flat-square" />
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint" />
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier" />
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

| This package provides a function to validate users' credentials by using a set of extendable validators. |
| -------------------------------------------------------------------------------------------------------- |

## 🛠 Install

### npm or yarn

Install the `@bandada/credentials` package with npm:

```bash
npm i @bandada/credentials
```

or yarn:

```bash
yarn add @bandada/credentials
```

## 📜 Usage

\# **validateCredentials**(credentials: _Credentials_, context: _Context_)

```typescript
import { validateCredentials, githubFollowers } from "@bandada/credentials"

validateCredentials(
    {
        id: githubFollowers.id,
        criteria: {
            minFollowers: 100
        }
    },
    {
        accessToken: {
            github: "token"
        }
    }
)
```

### Custom validators

The library has been built to allow external devs to add their own validators. A validator is a simple file that exports 3 JavaScript values:

1. `id`: The validator id. It must be unique and capitalized (snake case).
2. `criteriaABI`: The criteria ABI. It contains the structure of your criteria with its types.
3. `validate`: The validator handler. It usually consists of three steps: criteria types check, user data retrieval and credentials' validation.

```typescript
import { Handler } from "@bandada/credentials"

// Typescript type for the handler criteria.
// This will be mainly used by this handler.
export type Criteria = {
    minFollowers: number
}

const validator: Validator = {
    id: "GITHUB_FOLLOWERS",

    // The criteria application binary interface. It contains
    // the structure of this validator credentials
    // with its parameter types.
    criteriaABI: {
        minFollowers: "number"
    },

    /**
     * It checks if a user has more than 'minFollowers' followers.
     * @param criteria The criteria used to check user's credentials.
     * @param context Utility functions and other context variables.
     * @returns True if the user meets the credentials.
     */
    async validate(criteria: Criteria, { utils }) {
        // Step 1: use the API to get the user's parameters.
        const { followers } = await utils.api("user")

        // Step 2: check if they meet the validator credentials.
        return followers >= criteria.minFollowers
    }
}

export default validator
```

Testing your validator is also important. If you use Jest you can use some test utilities to mock the API function easily.

```typescript
import {
    addValidator,
    testUtils,
    validateCredentials
} from "@bandada/credentials"
import githubFollowers from "./index"

describe("GithubFollowers", () => {
    beforeAll(() => {
        addValidator(githubFollowers)
    })

    it("Should return true if a Github user has more than 100 followers", async () => {
        testUtils.mockAPIOnce({
            followers: 110
        })

        const result = await validateCredentials(
            {
                id: "GITHUB_FOLLOWERS",
                criteria: {
                    minFollowers: 100
                }
            },
            {
                accessTokens: {
                    github: "token"
                }
            }
        )

        expect(result).toBeTruthy()
    })
})
```

Once you create your own validator and publish your NPM package, you can open a PR to add your validator to the ones supported by Bandada (`validators.ts` file). You can also add a new provider to the `providers.ts` file.
