import providers from "./providers"
import { Provider } from "./types"

/**
 * It returns an existing provider. If the provider does not exist
 * it throws an error.
 * @param providerName The provider name.
 * @returns The provider.
 */
export default function getProvider(providerName: string): Provider {
    const provider = providers.find((p) => p.name === providerName)

    if (!provider) {
        throw Error(`Provider '${providerName}' does not exist`)
    }

    return provider
}
