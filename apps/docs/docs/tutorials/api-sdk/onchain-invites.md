---
sidebar_position: 2
title: On-chain group invites
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# Using invite codes with on-chain groups

This tutorial will guide you through the complete process of adding a user to an on-chain group via invite codes.

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
npm install @bandada/utils
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add @bandada/utils
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm add @bandada/utils
```

</TabItem>
</Tabs>

## Create a new instance

After installing the utils package, create a new instance of `Semaphore`. 

More details on the utils package can be found [here](https://github.com/bandada-infra/bandada/tree/main/libs/utils).

- Create a new instance of Semaphore contract.

```ts
import { getSemaphoreContract } from "@bandada/utils"

const semaphore = getSemaphoreContract("sepolia")
```

- Create a new instance of Semaphore contract with signer.

```ts
import { getSemaphoreContract } from "@bandada/utils"
import { useSigner } from "wagmi"

const { data: signer } = useSigner()

const semaphore = getSemaphoreContract("sepolia", signer)
```

You can choose to use another signer package of your choice, wagmi is just an example.


## Create a group

Create a new on-chain group with an associated group.

```ts
const semaphore = getSemaphoreContract("sepolia", signer as any)
const admin = await signer.getAddress()

// create on-chain group
const receipt = await semaphore.createGroup(admin)

const groupIdBigNumber = receipt.events?.[0]?.args?.[0].toString()
const onchainGroupId = groupIdBigNumber.toString()

const apiKey = "your-api-key"
const groupCreationDetails = {
    name: onchainGroupId,
    description: `This group is associated to the on-chain group ${onchainGroupId}`,
    treeDepth: 16,
    fingerprintDuration: 3600
}

// create associated group
const group = apiSdk.createGroup(groupCreationDetails, apiKey)
```

## Add members to on-chain group using invite code

Create a new group invite.

```ts
const groupId = "your-associated-group-id"
const apiKey = "your-api-key"

const invite = await apiSdk.createInvite(groupId, apiKey)
```

## Add member using an invite code

Adds a member to an on-chain group using an invite code.

```ts
const groupId = "your-group-id"
const memberId = "member-id"
const inviteCode = "INVITECODE"

const group = await semaphore.getGroup(groupId, {
    members: true
})

const invite = await apiSdk.getInvite(inviteCode)
const apiKey = "your-api-key"

if(invite.isRedeemed) {
    throw new Error(`Invite code '${inviteCode}' has already been redeemed`)
} else {
    await semaphore.addMember(group.id, memberId)
    
    await apiSdk.redeemInvite(inviteCode, invite.group.id, apiKey)
}
```

## Full example

This is an example of how the whole code would look like:

```ts
import { getSemaphoreContract } from "@bandada/utils"
import { ApiSdk, SupportedUrl } from "@bandada/api-sdk"
import { useSigner } from "wagmi"

const apiSdk = new ApiSdk(SupportedUrl.DEV)
const semaphore = getSemaphoreContract("sepolia", signer as any)
const { data: signer } = useSigner()

const admin = await signer.getAddress()

// create on-chain group
const receipt = await semaphore.createGroup(admin)

const groupIdBigNumber = receipt.events?.[0]?.args?.[0].toString()
const onchainGroupId = groupIdBigNumber.toString()

const apiKey = "your-api-key"
const memberId = "member-id-1"

const groupCreationDetails = {
    name: onchainGroupId,
    description: `This group is associated with the on-chain group ${onchainGroupId}`,
    treeDepth: 16,
    fingerprintDuration: 3600
}

// create associated group
const associatedGroup = apiSdk.createGroup(groupCreationDetails, apiKey)

// generate invite code with the associated group id
const invite = await apiSdk.createInvite(associatedGroup.id, apiKey)

// check if the invite code has been redeemed
if(invite.isRedeemed) {
    throw new Error(`Invite code '${invite.code}' has already been redeemed`)
} else {
    // add member to on-chain group
    await semaphore.addMember(onchainGroupId, memberId)

    // redeem the invite code after successfully adding the member to the on-chain group
    await apiSdk.redeemInvite(invite.code, associatedGroup.id, apiKey)
}
```
