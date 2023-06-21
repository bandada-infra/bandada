import addProvider from "./addProvider"
import { Provider } from "./types"

/**
 * It adds a list of new providers.
 * @param providers The list of providers to be added.
 */
export default function addProviders(providers: Provider[]) {
    for (const provider of providers) {
        addProvider(provider)
    }
}
