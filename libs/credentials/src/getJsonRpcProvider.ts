import { providers } from "ethers"

export default function getJsonRpcProvider(url: string): any {
    const jsonRpcProvider = new providers.JsonRpcProvider(url)
    return jsonRpcProvider
}
