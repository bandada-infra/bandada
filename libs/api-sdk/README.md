<p align="center">
    <h1 align="center">
        Bandada API SDK
    </h1>
    <p align="center">A Typescript SDK for the Bandada API.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/bandada">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/bandada.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@bandada/api-sdk">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@bandada/api-sdk?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@bandada/api-sdk">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@bandada/api-sdk.svg?style=flat-square" />
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
        <a href="https://pse.dev/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| This package provides a list of functions to make it easier to work with the Bandada API. |
| ----------------------------------------------------------------------------------------- |

## 🛠 Install

### npm or yarn

Install the `@bandada/api-sdk` package with npm:

```bash
npm i @bandada/api-sdk
```

or yarn:

```bash
yarn add @bandada/api-sdk
```

## 📜 Usage

\# **new ApiSdk**(url: SupportedUrl | string, config?: object): _ApiSdk_

Creates a new instance of ApiSdk using the API URL and the [config](https://axios-http.com/docs/req_config).

-   Creates a new instance using the Bandada API URL and the default config.

```ts
const apiSdk = new ApiSdk()
```

-   Creates a new instance using a custom API URL.

```ts
const apiSdk = new ApiSdk("https://example.com/api")
```

-   Creates a new instance using a custom API URL and config.

```ts
const url = "https://example.com/api"
const config = {
    headers: {
        "Content-Type": "text/html"
    }
}
const apiSdk = new ApiSdk(url, config)
```

\# **getGroups**(): _Promise\<GroupResponse[]>_

Returns the list of groups.

```ts
const groups = await apiSdk.getGroups()
```

\# **getGroup**(): _Promise\<GroupResponse>_

Returns a specific group.

```ts
const groupId = "10402173435763029700781503965100"

const group = await apiSdk.getGroup(groupId)
```

\# **isGroupMember**(): _Promise\<boolean>_

Returns true if the member is in the group and false otherwise.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"

const isMember = await apiSdk.isGroupMember(groupId, memberId)
```

\# **generateMerkleProof**(): _Promise\<string>_

Returns the Merkle Proof for a member in a group.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"

const proof = await apiSdk.generateMerkleProof(groupId, memberId)
```

\# **addMemberByApiKey**(): _Promise\<void>_

Adds a member to a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.addMemberByApiKey(groupId, memberId, apiKey)
```

\# **addMembersByApiKey**(): _Promise\<void>_

Adds multiple members to a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberIds = ["1", "2", "3"]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.addMembersByApiKey(groupId, memberIds, apiKey)
```

\# **addMemberByInviteCode**(): _Promise\<void>_

Adds a member to a group using an Invite Code.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"
const inviteCode = "MQYS4UR5"

await apiSdk.addMemberByInviteCode(groupId, memberId, inviteCode)
```

\# **removeMemberByApiKey**(): _Promise\<void>_

Removes a member from a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberId = "1"
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.removeMemberByApiKey(groupId, memberId, apiKey)
```

\# **removeMembersByApiKey**(): _Promise\<void>_

Removes multiple members from a group using an API Key.

```ts
const groupId = "10402173435763029700781503965100"
const memberIds = ["1", "2", "3"]
const apiKey = "70f07d0d-6aa2-4fe1-b4b9-06c271a641dc"

await apiSdk.removeMembersByApiKey(groupId, memberIds, apiKey)
```
