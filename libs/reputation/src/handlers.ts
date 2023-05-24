import githubFollowers, {
    criteriaTypes as githubFollowersCriteriaTypes
} from "./handlers/githubFollowers"
import { ValidatorName, Handler } from "./types"

export default {
    GITHUB_FOLLOWERS: [githubFollowers, githubFollowersCriteriaTypes]
} as Record<ValidatorName, [Handler, any]>
