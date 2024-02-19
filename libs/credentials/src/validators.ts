import { Validator } from "./types"
import {
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser,
    blockchainTransactions,
    blockchainBalance,
    easAttestations
} from "./validators/index"

const validators: Validator[] = [
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser,
    blockchainTransactions,
    blockchainBalance,
    easAttestations
]

export default validators
