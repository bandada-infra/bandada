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

## Validate credentials

## Validate blockchain balance

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the blockchain balance of a user.

-   **credentials** (_Credentials_):
    -   **id**: The id for the blockchain balance validation.
    -   **criteria**:
        -   **minBalance**: The minimum number of balance required.
        -   **network**: The blockchain network to validate against.
        -   **blockNumber** (_optional_): The block number at which to check the balance.
-   **context** (_Context_):
    -   **address**: The blockchain address to validate.
    -   **jsonRpcProvider**: The JSON-RPC provider to use for blockchain interactions.

```typescript
import {
    validateCredentials,
    blockchainBalance,
    getProvider,
    BlockchainProvider
} from "@bandada/credentials"

const provider = getProvider("blockchain")

const jsonRpcProvider = await (
    provider as BlockchainProvider
).getJsonRpcProvider("https://rpc-url.com")

validateCredentials(
    {
        id: blockchainBalance.id,
        criteria: {
            minBalance: "10",
            network: "sepolia",
            blockNumber: 4749638
        }
    },
    {
        address: "0x",
        jsonRpcProvider
    }
)
```

## Validate blockchain transactions

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the blockchain transactions of a user.

-   **credentials** (_Credentials_):
    -   **id**: The id for the blockchain transactions validation.
    -   **criteria**:
        -   **minTransactions**: The minimum number of transactions required.
        -   **network**: The blockchain network to validate against.
        -   **blockNumber** (_optional_): The block number at which to check the transactions.
-   **context** (_Context_):
    -   **address**: The blockchain address to validate.
    -   **jsonRpcProvider**: The JSON-RPC provider to use for blockchain interactions.

```typescript
import {
    validateCredentials,
    blockchainTransactions,
    getProvider,
    BlockchainProvider
} from "@bandada/credentials"

const provider = getProvider("blockchain")

const jsonRpcProvider = await (
    provider as BlockchainProvider
).getJsonRpcProvider("https://rpc-url.com")

validateCredentials(
    {
        id: blockchainTransactions.id,
        criteria: {
            minTransactions: 10,
            network: "sepolia",
            blockNumber: 4749638
        }
    },
    {
        address: "0x",
        jsonRpcProvider
    }
)
```

## Validate EAS (Ethereum Attestation Service) attestations

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the EAS attestations of a user.

-   **credentials** (_Credentials_):
    -   **id**: The id for the EAS attestations validation.
    -   **criteria**:
        -   **minAttestations**: The minimum number of attestations required.
        -   **attester** (_optional_): The attester of the attestation.
        -   **schemaId** (_optional_): The schema id of the attestation.
        -   **revocable** (_optional_): The revocable option of the attestation.
        -   **revoked** (_optional_): The revocation status of the attestation.
        -   **isOffchain** (_optional_): The type of chain of the attestation.
-   **context** (_Context_):
    -   **network**: The EAS network chain.
    -   **address**: The user address to validate.

```typescript
import {
    validateCredentials,
    easAttestations,
    EASNetworks
} from "@bandada/credentials"

validateCredentials(
    {
        id: easAttestations.id,
        criteria: {
            minAttestations: 1,
            schemaId: "0x",
            attester: "0x1",
            revocable: false,
            revoked: false,
            isOffchain: false
        }
    },
    {
        network: EASNetworks.ETHEREUM_SEPOLIA,
        address: "0x2"
    }
)
```

## Validate GitHub followers

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the number of followers of a GitHub user.

-   **credentials** (_Credentials_):
    -   **id**: The id for the GitHub followers validation.
    -   **criteria**:
        -   **minFollowers**: The minimum number of GitHub followers required.
-   **context** (_Context_):
    -   **profile**: The user's GitHub profile.
    -   **accessTokens**:
        -   **github**: The user's GitHub login access token.

```typescript
import {
    validateCredentials,
    githubFollowers,
    getProvider,
    Web2Provider
} from "@bandada/credentials"

const provider = getProvider("github")

const accessToken = await (provider as Web2Provider).getAccessToken(
    "clientId",
    "clientSecret",
    "oAuthCode",
    "oAuthState",
    "redirectUri"
)

const profile = await (provider as Web2Provider).getProfile(accessToken)

validateCredentials(
    {
        id: githubFollowers.id,
        criteria: {
            minFollowers: 100
        }
    },
    {
        profile,
        accessTokens: {
            github: accessToken
        }
    }
)
```

## Validate GitHub personal stars

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the number of stars in a GitHub user's personal repositories.

-   **credentials** (_Credentials_):
    -   **id**: The id for the GitHub personal stars validation.
    -   **criteria**:
        -   **minStars**: The minimum number of GitHub personal stars required.
-   **context** (_Context_):
    -   **profile**: The user's GitHub profile.
    -   **accessTokens**:
        -   **github**: The user's GitHub login access token.

```typescript
import {
    validateCredentials,
    githubPersonalStars,
    getProvider,
    Web2Provider
} from "@bandada/credentials"

const provider = getProvider("github")

const accessToken = await (provider as Web2Provider).getAccessToken(
    "clientId",
    "clientSecret",
    "oAuthCode",
    "oAuthState",
    "redirectUri"
)

const profile = await (provider as Web2Provider).getProfile(accessToken)

validateCredentials(
    {
        id: githubPersonalStars.id,
        criteria: {
            minStars: 100
        }
    },
    {
        profile,
        accessTokens: {
            github: accessToken
        }
    }
)
```

## Validate GitHub repository commits

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the number of commits by a GitHub user in a specific repository.

-   **credentials** (_Credentials_):
    -   **id**: The id for the GitHub repository commit validation.
    -   **criteria**:
        -   **minCommits**: The minimum number of GitHub commits required.
        -   **repository**: The name of the target GitHub repository.
-   **context** (_Context_):
    -   **profile**: The user's GitHub profile.
    -   **accessTokens**:
        -   **github**: The user's GitHub login access token.

```typescript
import {
    validateCredentials,
    githubRepositoryCommits,
    getProvider,
    Web2Provider
} from "@bandada/credentials"

const provider = getProvider("github")

const accessToken = await (provider as Web2Provider).getAccessToken(
    "clientId",
    "clientSecret",
    "oAuthCode",
    "oAuthState",
    "redirectUri"
)

const profile = await (provider as Web2Provider).getProfile(accessToken)

validateCredentials(
    {
        id: githubRepositoryCommits.id,
        criteria: {
            repository: "hello-world",
            minCommits: 100
        }
    },
    {
        profile,
        accessTokens: {
            github: accessToken
        }
    }
)
```

## Validate Twitter(X) followers

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates the number of followers of a Twitter(X) user.

-   **credentials** (_Credentials_):
    -   **id**: The id for the Twitter(X) followers validation.
    -   **criteria**:
        -   **minFollowers**: The minimum number of followers required.
-   **context** (_Context_):
    -   **profile**: The user's Twitter(X) profile.
    -   **accessTokens**:
        -   **github**: The user's Twitter(X) login access token.

```typescript
import {
    validateCredentials,
    twitterFollowers,
    getProvider,
    Web2Provider
} from "@bandada/credentials"

const provider = getProvider("twitter")

const accessToken = await (provider as Web2Provider).getAccessToken(
    "clientId",
    "clientSecret",
    "oAuthCode",
    "oAuthState",
    "redirectUri"
)

const profile = await (provider as Web2Provider).getProfile(accessToken)

validateCredentials(
    {
        id: twitterFollowers.id,
        criteria: {
            minFollowers: 100
        }
    },
    {
        profile,
        accessTokens: {
            twitter: accessToken
        }
    }
)
```

## Validate Twitter(X) following user

\# **validateCredentials**(credentials: _Credentials_, context: _Context_): _Promise\<boolean>_

Validates whether a Twitter(X) user follows a specific user.

-   **credentials** (_Credentials_):
    -   **id**: The id for the Twitter(X) following user validation.
    -   **criteria**:
        -   **username**: The username of the target Twitter(X) user.
-   **context** (_Context_):
    -   **profile**: The user's Twitter(X) profile.
    -   **accessTokens**:
        -   **github**: The user's Twitter(X) login access token.

```typescript
import {
    validateCredentials,
    twitterFollowingUser,
    getProvider,
    Web2Provider
} from "@bandada/credentials"

const provider = getProvider("twitter")

const accessToken = await (provider as Web2Provider).getAccessToken(
    "clientId",
    "clientSecret",
    "oAuthCode",
    "oAuthState",
    "redirectUri"
)

const profile = await (provider as Web2Provider).getProfile(accessToken)

validateCredentials(
    {
        id: twitterFollowingUser.id,
        criteria: {
            username: "hello"
        }
    },
    {
        profile,
        accessTokens: {
            twitter: accessToken
        }
    }
)
```

## Validate many credentials

\# **validateManyCredentials**(credentials: _Credentials_[], context: _Context_[], expression: _string_[]): _Promise\<boolean>_

Validates many credentials with parentheses in the expression.

-   **credentials** (_Credentials_[]):
    -   Refer to examples above for different criteria objects.
-   **context** (_Context_[]):
    -   Refer to examples above for different context objects.
-   **expressions** (_string_[]):
    -   Array of string for expressions.

```typescript
import {
    validateManyCredentials,
    blockchainBalance,
    blockchainTransactions,
    githubPersonalStars
} from "@bandada/credentials"

const credentials = [
    {
        id: blockchainBalance.id,
        criteria: {
            minBalance: "10",
            network: "sepolia"
        }
    },
    {
        id: blockchainTransactions.id,
        criteria: {
            minTransactions: 10,
            network: "sepolia"
        }
    },
    {
        id: githubPersonalStars.id,
        criteria: {
            minStars: 100
        }
    }
]

const contexts = [
    {
        address: "0x",
        jsonRpcProvider
    },
    {
        address: "0x",
        jsonRpcProvider
    },
    {
        profile: {},
        accessTokens: { github: "token" }
    }
]

const expression = ["", "and", "(", "", "or", "", ")"]

validateManyCredentials(credentials, contexts, expression)
```

## Custom validators

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
