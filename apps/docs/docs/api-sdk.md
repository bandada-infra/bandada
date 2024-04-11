---
sidebar_position: 3
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# API SDK

[The API SDK JavaScript package](https://github.com/bandada-infra/bandada/tree/main/libs/api-sdk) provides a list of functions to make it easier to work with the Bandada API. 

Example of project using the API SDK library: [bandada-api-sdk-demo](https://github.com/bandada-infra/bandada-sdk-demo).

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

\# **new ApiSdk**(url: SupportedUrl | string, config?: object): _ApiSdk_

Creates a new instance of ApiSdk using the API URL and the [config](https://axios-http.com/docs/req_config).

-   Create a new instance using the Bandada API URL and the default config.

This is what you need if you are using the production Bandada API.

```ts
import { ApiSdk } from "@bandada/api-sdk"

const apiSdk = new ApiSdk()
```

-   Create a new instance using a [Supported URL](https://github.com/bandada-infra/bandada/blob/main/libs/api-sdk/src/types/index.ts#L43).

This is useful when working with the development environment.

```ts
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"

const apiSdk = new ApiSdk(SupportedUrl.DEV)
```

-   Create a new instance using a custom API URL.

```ts
import { ApiSdk } from "@bandada/api-sdk"

const apiSdk = new ApiSdk("https://example.com/api")
```

-   Create a new instance using a custom API URL and config.

```ts
import { ApiSdk } from "@bandada/api-sdk"

const url = "https://example.com/api"
const config = {
    headers: {
        "Content-Type": "text/html"
    }
}
const apiSdk = new ApiSdk(url, config)
```

## Create group

\# **createGroup**(): _Promise\<Group>_

Creates a Bandada group.

```ts
const groupCreateDetails = {
    name: "Group 1",
    description: "This is Group 1.",
    treeDepth: 16,
    fingerprintDuration: 3600
}
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

const group = await apiSdk.createGroup(groupCreateDetails, apiKey)
```

## Create groups

\# **createGroups**(): _Promise\<Group[]>_

Creates one or many Bandada groups.

```ts
const groupsCreateDetails = [
    {
        name: "Group 1",
        description: "This is Group 1.",
        treeDepth: 16,
        fingerprintDuration: 3600
    },
    {
        name: "Group 2",
        description: "This is Group 2.",
        treeDepth: 16,
        fingerprintDuration: 3600
    }
]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

const groups = await apiSdk.createGroups(groupsCreateDetails, apiKey)
```

## Remove group

\# **removeGroup**(): _Promise\<void>_

Removes a specific Bandada group.

```ts
const groupId = "10402173435763029700781503965100"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.removeGroup(groupId, apiKey)
```

## Remove groups

\# **removeGroups**(): _Promise\<void>_

Removes one or many Bandada groups.

```ts
const groupIds = [
    "10402173435763029700781503965100",
    "20402173435763029700781503965200"
]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.removeGroups(groupIds, apiKey)
```

## Update group

\# **updateGroup**(): _Promise\<Group>_

Updates a specific Bandada group.

```ts
const groupId = "10402173435763029700781503965100"
const groupUpdateDetails = {
    description: "This is a new group.",
    treeDepth: 20,
    fingerprintDuration: 4000
}
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.updateGroup(groupId, groupUpdateDetails, apiKey)
```

## Update groups

\# **updateGroups**(): _Promise\<Group[]>_

Updates one or many Bandada groups.

```ts
const groupIds = [
    "10402173435763029700781503965100",
    "20402173435763029700781503965200"
]
const updatedGroups: Array<GroupUpdateDetails> = [
    {
        description: "This is a new group1.",
        treeDepth: 32,
        fingerprintDuration: 7200
    },
    {
        description: "This is a new group2.",
        treeDepth: 32,
        fingerprintDuration: 7200
    }
]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.updateGroups(groupId, groupUpdateDetails, apiKey)
```

## Get group

\# **getGroup**(): _Promise\<Group>_

Returns a specific group.

```ts
const groupId = "10402173435763029700781503965100"

const group = await apiSdk.getGroup(groupId)
```

## Get groups

\# **getGroups**(): _Promise\<Group[]>_

Returns the list of groups.

```ts
const groups = await apiSdk.getGroups()
```

## Is group member

\# **isGroupMember**(): _Promise\<boolean>_

Returns true if the member is in the group and false otherwise.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"

const isMember = await apiSdk.isGroupMember(groupId, memberId)
```

## Generate merkle proof

\# **generateMerkleProof**(): _Promise\<string>_

Returns the Merkle Proof for a member in a group.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"

const proof = await apiSdk.generateMerkleProof(groupId, memberId)
```

## Add member using an API Key

\# **addMemberByApiKey**(): _Promise\<void>_

Adds a member to a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.addMemberByApiKey(groupId, memberId, apiKey)
```

## Add members using an API Key

\# **addMembersByApiKey**(): _Promise\<void>_

Adds multiple members to a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberIds = ["1", "2", "3"]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.addMembersByApiKey(groupId, memberIds, apiKey)
```

## Add member using an invite code

\# **addMemberByInviteCode**(): _Promise\<void>_

Adds a member to a group using an Invite Code.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"
const inviteCode = "MQYS4UR5"

await apiSdk.addMemberByInviteCode(groupId, memberId, inviteCode)
```

## Remove member using an API Key

\# **removeMemberByApiKey**(): _Promise\<void>_

Removes a member from a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.removeMemberByApiKey(groupId, memberId, apiKey)
```

## Remove members using an API Key

\# **removeMembersByApiKey**(): _Promise\<void>_

Removes multiple members from a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberIds = ["1", "2", "3"]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.removeMembersByApiKey(groupId, memberIds, apiKey)
```

## Create invite  

\# **createInvite**(): _Promise\<Invite>_

Creates a new group invite.

```ts
const groupId = "10402173435763029700781503965100"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

const invite = await apiSdk.createInvite(groupId, apiKey)
```

## Get invite

\# **getInvite**(): _Promise\<Invite>_

Returns a specific invite.

```ts
const inviteCode = "C5VAG4HD"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

const invite = await apiSdk.getInvite(inviteCode)
```
