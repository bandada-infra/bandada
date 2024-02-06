import { Provider } from "./types"
import { github, twitter, blockchain } from "./providers/index"

const providers: Provider[] = [github, twitter, blockchain]

export default providers
