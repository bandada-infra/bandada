import { ethers } from "ethers"

export default function shortenAddress(address: string, chars = 4): string {
    address = ethers.getAddress(address)

    return `${address.substring(0, chars + 2)}...${address.substring(
        42 - chars
    )}`
}
