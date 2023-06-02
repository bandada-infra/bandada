<p align="center">
    <h1 align="center">
        Bandada reputation
    </h1>
    <p align="center">Bandada library to validate users' reputation.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/bandada">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/bandada.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@bandada/reputation">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@bandada/reputation?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@bandada/reputation">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@bandada/reputation.svg?style=flat-square" />
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
        <a href="https://github.com/privacy-scaling-explorations/bandada/blob/main/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/privacy-scaling-explorations/bandada/blob/main/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/privacy-scaling-explorations/bandada/contribute">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://appliedzkp.org/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| This package provides a function to validate users' reputation by using a set of extendable validators. |
| ------------------------------------------------------------------------------------------------------- |

## 🛠 Install

### npm or yarn

Install the `@bandada/reputation` package with npm:

```bash
npm i @bandada/reputation
```

or yarn:

```bash
yarn add @bandada/reputation
```

## 📜 Usage

\# **addValidator**(validator: _Validator_)

```typescript
import { addValidator, githubFollowers } from "@bandada/reputation"

addValidator(githubFollowers)
```

\# **addValidators**(validators: _Validator[]_)

```typescript
import {
    addValidators,
    githubFollowers,
    twitterFollowers
} from "@bandada/reputation"

addValidators([githubFollowers, twitterFollowers])
```

\# **validateReputation**(reputationCriteria: _ReputationCriteria_, context: _Context_)

```typescript
import { validateReputation, githubFollowers } from "@bandada/reputation"

validateReputation(
    {
        name: githubFollowers.name,
        criteria: {
            minFollowers: 100
        }
    },
    {
        githubAccessToken: "token"
    }
)
```

### Custom validators

The library has been built to allow external devs to add their own validators. A validator is a simple file that exports 3 JavaScript values:

1. `name`: The validater name. It must be unique and capitalized (snake case).
2. `criteriaABI`: The criteria ABI. It contains the structure of your reputation criteria with their types.
3. `validate`: The validator handler. It usually consists of three steps: criteria types check, user data retrieval and reputation validation.

```typescript
import { Handler } from "@bandada/reputation"

// Typescript type for the handler criteria.
// This will be mainly used by this handler.
export type Criteria = {
    minFollowers: number
}

const name = "GITHUB_FOLLOWERS"

// The criteria application binary interface. It contains
// the structure of this validator reputation criteria
// with its parameter types.
const criteriaABI = {
    minFollowers: "number"
}

/**
 * It checks if a user has more then 'minFollowers' followers.
 * @param criteria The reputation criteria used to check user's reputation.
 * @param context Utility functions and other context variables.
 * @returns True if the user meets the reputation criteria.
 */
const validate: Handler = async (criteria: Criteria, { utils }) => {
    // Step 1: check if the criteria parameters are the right ones (proper structure and types).
    utils.checkCriteria(criteria, criteriaABI)

    // Step 2: use the API to get the user's parameters.
    const { followers } = await utils.githubAPI("user")

    // Step 3: check if they meet the validator reputation criteria.
    return followers >= criteria.minFollowers
}

export default {
    name,
    criteriaABI,
    validate
}
```

Testing your validator is also important. If you use Jest you can use some test utilities to mock the `fetch` function easily.

```typescript
import {
    addValidator,
    testUtils,
    validateReputation
} from "@bandada/reputation"
import githubFollowers from "./index"

global.fetch = jest.fn()

describe("GithubFollowers", () => {
    beforeAll(() => {
        addValidator(githubFollowers)
    })

    it("Should return true if a Github user has more than 100 followers", async () => {
        testUtils.mockAPIOnce({
            followers: 110
        })

        const result = await validateReputation(
            {
                name: "GITHUB_FOLLOWERS",
                criteria: {
                    minFollowers: 100
                }
            },
            { githubAccessToken: "token" }
        )

        expect(result).toBeTruthy()
    })
})
```

Once you create your own validator and publish your NPM package, you can open a PR to add your validator to the ones supported by Bandada.
