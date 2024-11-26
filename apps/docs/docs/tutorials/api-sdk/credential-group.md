---
sidebar_position: 1
title: Credential groups
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# Credential groups

This tutorial will guide you on how to create a credential group and a multiple credentials group using the API SDK.

## Install library

<Tabs
defaultValue="npm"
groupId="package-managers"
values={[
{label: 'npm', value: 'npm'},
{label: 'Yarn', value: 'yarn'},
{label: 'pnpm', value: 'pnpm'}
]}>
<TabItem value="npm">

```bash
npm install @bandada/api-sdk
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add @bandada/api-sdk
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm add @bandada/api-sdk
```

</TabItem>
</Tabs>

## Create a new instance

After installing the API SDK, create a new instance of ApiSdk using the API URL and the [config](https://axios-http.com/docs/req_config).

You can choose to:

-   Create a new instance using the Bandada API URL and the default config.

```ts
import { ApiSdk } from "@bandada/api-sdk"

const apiSdk = new ApiSdk()
```

-   Create a new instance using a [Supported URL](https://github.com/bandada-infra/bandada/blob/main/libs/api-sdk/src/types/index.ts#L43).

```ts
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"

const apiSdk = new ApiSdk(SupportedUrl.DEV)
```
## Create a credential group

Create a new credential group using the API SDK.

```ts
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"

const apiSdk = new ApiSdk(SupportedUrl.DEV)

const apiKey = "0x"

const credentials = {
    id: "BLOCKCHAIN_BALANCE",
    criteria: {
        minBalance: "10",
        network: "Sepolia"
    }
}

const groupCreationDetails = {
    name: "Credential Group",
    description: "This is a description",
    treeDepth: 16,
    fingerprintDuration: 3600,
    credentials
}

const credentialGroup = apiSdk.createGroup(groupCreationDetails, apiKey)
```
## Create a multiple credentials group

Create a multiple credentials group using the API SDK

```ts
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"

const apiSdk = new ApiSdk(SupportedUrl.DEV)

const apiKey = "0x"

const credentials = {
    credentials: [
        {
            id: "BLOCKCHAIN_TRANSACTIONS",
            criteria: {
                minTransactions: 10,
                network: "Sepolia"
            }
        },
        {
            id: "BLOCKCHAIN_BALANCE",
            criteria: {
                minBalance: "5",
                network: "Sepolia"
            }
        }
    ],
    expression: ["", "and", ""]
}

const groupCreationDetails = {
    name: "Credential Group",
    description: "This is a description",
    treeDepth: 16,
    fingerprintDuration: 3600,
    credentials
}

const credentialGroup = apiSdk.createGroup(groupCreationDetails, apiKey)
```
More details on the credentials can be found at the [Credentials library](https://github.com/bandada-infra/bandada/tree/main/libs/credentials).