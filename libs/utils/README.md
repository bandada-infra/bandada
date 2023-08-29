<p align="center">
    <h1 align="center">
        Bandada utils
    </h1>
    <p align="center">General Bandada utility functions.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/bandada">
        <img src="https://img.shields.io/badge/project-Bandada-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/bandada/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/bandada.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@bandada/utils">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@bandada/utils?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@bandada/utils">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@bandada/utils.svg?style=flat-square" />
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

| This package provides simple utility functions that can be used by Bandada itself or externals. |
| ----------------------------------------------------------------------------------------------- |

## 🛠 Install

### npm or yarn

Install the `@bandada/utils` package with npm:

```bash
npm i @bandada/utils
```

or yarn:

```bash
yarn add @bandada/utils
```

## 📜 Usage

\# **request**(url: string, config?: AxiosRequestConfig): _Promise\<any>_

Makes a request using Axios.

```ts
import { request } from "@bandada/utils"

const url = "https://api.bandada.pse.dev/groups"
const config = {
    headers: {
        "Content-Type": "application/json"
    },
    baseURL: "https://api.bandada.pse.dev"
}
const group = await request(url, config)
```

\# **shortenAddress**(address: string, chars: number): _string_

Returns a shorter address.

```ts
import { shortenAddress } from "@bandada/utils"

const address = shortenAddress("0x1234567890123456789012345678901234567890")
```

\# **getProvider**(network: Network, apiKey?: string): _JsonRpcProvider_

Returns the provider to communicate with the blockchain.

```ts
import { getProvider } from "@bandada/utils"

const provider = getProvider("localhost")
```

\# **getContract**(contractName: ContractName, network: Network, privateKeyOrSigner?: string | Signer, apiKey?: string): _Contract_

Returns an [Ethers](https://docs.ethers.org/) contract.

```ts
import { getContract } from "@bandada/utils"

const contractName = "Semaphore"
const network = "localhost"
const contract = getContract(contractName, network)
```

\# **getSemaphoreContract**(network: Network, privateKeyOrSigner?: string | Signer, apiKey?: string): _SemaphoreContract_

Returns a new instance of the SemaphoreContract class.

```ts
import { getSemaphoreContract } from "@bandada/utils"

const semaphore = getSemaphoreContract("localhost")
```

\# **getBandadaContract**(network: Network, privateKeyOrSigner?: string | Signer, apiKey?: string): _BandadaContract_

Returns a new instance of the BandadaContract class.

```ts
import { getBandadaContract } from "@bandada/utils"

const bandada = getBandadaContract("localhost")
```

\# **getWallet**(privateKey: string, network?: Network, apiKey?: string): _JsonRpcProvider_

Returns an [Ethers](https://docs.ethers.org/) wallet.

```ts
import { getWallet } from "@bandada/utils"

const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const wallet = getWallet(privateKey)
```

\# **getContractAddresses**(networkName: Network): _{
Bandada: string,
Semaphore: string,
BandadaSemaphore: string
}_

Returns the contract addresses for the Bandada, Semaphore and BandadaSemaphore smart contracts.

```ts
import { getContractAddresses } from "@bandada/utils"

const addresses = getContractAddresses("goerli")
```
