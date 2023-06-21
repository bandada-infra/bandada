import { Provider } from "./types"
import providers from "./providers"

/**
 * It adds a new provider.
 * @param provider The provider to be added.
 */
export default function addProvider(provider: Provider) {
    providers.push(provider)
}
