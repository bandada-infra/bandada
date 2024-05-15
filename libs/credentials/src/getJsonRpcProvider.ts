import { ethers } from "ethers"

export default function getJsonRpcProvider(url: string): any {
    const jsonRpcProvider = new ethers.JsonRpcProvider(url)
    return jsonRpcProvider
}
