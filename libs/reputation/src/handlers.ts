import githubFollowers, {
    parameterTypes as githubFollowersParameterTypes
} from "./handlers/githubFollowers"
import { CriteriaName, Handler } from "./types"

export default {
    GITHUB_FOLLOWERS: [githubFollowers, githubFollowersParameterTypes]
} as Record<CriteriaName, [Handler, any]>
