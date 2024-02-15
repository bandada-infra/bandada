import { Provider } from "./types"
import { github, twitter, blockchain, eas } from "./providers/index"

const providers: Provider[] = [github, twitter, blockchain, eas]

export default providers
