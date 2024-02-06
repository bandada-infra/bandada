import { Validator } from "./types"
import {
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser,
    blockchainTransactions,
    blockchainBalance
} from "./validators/index"

const validators: Validator[] = [
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser,
    blockchainTransactions,
    blockchainBalance
]

export default validators
