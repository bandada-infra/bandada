import githubFollowers from "./handlers/githubFollowers"
import { ReputationHandler, ReputationType } from "./types"

export default {
    GITHUB_FOLLOWERS: githubFollowers
    // TWITTER_FOLLOWERS: twitterFollowers,
    // REDDIT_KARMA: redditKarma
} as Record<ReputationType, ReputationHandler>
