---
sidebar_position: 1
title: Create and manage groups
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# Create and manage groups with API SDK

This tutorial will guide you through the complete process of creating and managing a group by using the API SDK.

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

After installing the API SDK, create a new instance of `ApiSdk` using the API URL and the [config](https://axios-http.com/docs/req_config).

You can choose to:

-   Create a new instance using the Bandada API URL with the default config.

```ts
import { ApiSdk } from "@bandada/api-sdk"

const apiSdk = new ApiSdk()
```

-   Create a new instance using a [Supported URL](https://github.com/bandada-infra/bandada/blob/main/libs/api-sdk/src/types/index.ts#L43).

```ts
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"

const apiSdk = new ApiSdk(SupportedUrl.DEV)
```

## Create a group

### Manual group

Create a new manual group using the API SDK.

```ts
const apiKey = "your-api-key"

const groupCreationDetails = {
    name: "Manual Group",
    description: "This is a description",
    treeDepth: 16,
    fingerprintDuration: 3600
}

const group = apiSdk.createGroup(groupCreationDetails, apiKey)
```

### Credential group

Create a new credential group using the API SDK.

```ts
const apiKey = "your-api-key"

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
### Multiple credentials group

Create a multiple-credentials group using the API SDK

```ts
const apiKey = "your-api-key"

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
    name: "Multiple Credentials Group",
    description: "This is a description",
    treeDepth: 16,
    fingerprintDuration: 3600,
    credentials
}

const credentialGroup = apiSdk.createGroup(groupCreationDetails, apiKey)
```
More details on the credentials can be found at the [Credentials library](https://github.com/bandada-infra/bandada/tree/main/libs/credentials).

## Add members to a group

### Manual group

You can add users directly to a manual group by using the API SDK.

```ts
const groupId = "your-group-id"
const memberId = "member-id-1"
const apiKey = "your-api-key"

await apiSdk.addMemberByApiKey(
    groupId,
    memberId,
    apiKey
)
```

### Add members using an invite code

Using the API SDK, you can invite users to join a manual group by sharing an invite code.

#### Create invite

Create a new group invite.

```ts
const groupId = "your-group-id"
const apiKey = "your-api-key"

const invite = await apiSdk.createInvite(groupId, apiKey)
```

You can wrap the invite code into a custom URL for your app, where it will handle the logic for adding a member to the group by invite code.

Here is an example of the custom URL structure:

```
https://<custom-domain>?inviteCode=<invite-code>
```

#### Get invite

Returns a specific invite along with the group details associated to the invite.

```ts
const inviteCode = "INVITECODE"
const apiKey = "your-api-key"

const invite = await apiSdk.getInvite(inviteCode)
```

#### Add member using an invite code

Adds a member to a group using an invite code.

```ts
const groupId = "your-group-id"
const memberId = "member-id-1"
const inviteCode = "INVITECODE"

await apiSdk.addMemberByInviteCode(groupId, memberId, inviteCode)
```

#### Full example

This is an example of how the whole code would look like:

```ts
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"

const apiSdk = new ApiSdk(SupportedUrl.DEV)

const groupId = "your-group-id"
const memberId = "member-id-1"
const apiKey = "your-api-key"

// generate invite code
const invite = await apiSdk.createInvite(groupId, apiKey)

// wrap the invite code into a custom URL for easier sharing
const inviteLink = `https://client.bandada.pse.dev?inviteCode=${invite.code}`

// add member to group by invite code
const response = await apiSdk.addMemberByInviteCode(
    invite.group.id, 
    memberId, 
    invite.code
)
```

You can refer to the [Client app](https://github.com/bandada-infra/bandada/blob/main/apps/client/src/pages/home.tsx) to better understand the context and logic for adding members to a group using an invite code.

### Credential group

You can invite users to join a credential group by generating the credential group join URL.

```ts
import { DashboardUrl } from "@bandada/api-sdk"

const dashboardUrl = DashboardUrl.DEV
const groupId = "your-group-id"
const commitment = "commitment-value"
const providerName = "github"
const redirectUri = "http://localhost:3003"

const url = apiSdk.getCredentialGroupJoinUrl(
    dashboardUrl,
    groupId,
    commitment,
    providerName,
    redirectUri
)
```

### Multiple credentials group

You can invite users to join a multiple credentials group by generating the multiple credentials group join URL.

```ts
import { DashboardUrl } from "@bandada/api-sdk"

const dashboardUrl = DashboardUrl.DEV
const groupId = "your-group-id"
const commitment = "commitment-value"
const redirectUri = "http://localhost:3003"

const url = apiSdk.getMultipleCredentialsGroupJoinUrl(
    dashboardUrl,
    groupId,
    commitment,
    redirectUri
)
```

Send the generated URL to the users you want to invite.

Upon clicking the generated URL, users will be redirected to the dashboard where they will need to validate their credentials based on the group credentials criteria.

Once the user has completed and passed the criteria validation, they will be added as a member to the group.

## Remove member from a group

You can remove members from a group by using the API SDK.

```ts
const groupId = "your-group-id"
const memberId = "member-id-1"
const apiKey = "your-api-key"

await apiSdk.removeMemberByApiKey(
    groupId,
    memberId,
    apiKey
)
```

## Remove multiple members from a group

You can remove multiple members from a group by using the API SDK.

```ts
const groupId = "your-group-id"
const memberId = ["member-id-1", "member-id-2", "member-id-3"]
const apiKey = "your-api-key"

await apiSdk.removeMemberByApiKey(
    groupId,
    memberId,
    apiKey
)
```

## Remove group

You can remove a group by using the API SDK.

```ts
const groupId = "your-group-id"
const apiKey = "your-api-key"

await apiSdk.removeGroup(groupId, apiKey)
```