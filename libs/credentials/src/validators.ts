import { Validator } from "./types"
import {
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser,
    blockchainTransactions
} from "./validators/index"

const validators: Validator[] = [
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser,
    blockchainTransactions
]

export default validators
