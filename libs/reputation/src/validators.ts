import { Validator } from "./types"
import {
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser
} from "./validators/index"

const validators: Validator[] = [
    githubFollowers,
    githubPersonalStars,
    githubRepositoryCommits,
    twitterFollowers,
    twitterFollowingUser
]

export default validators
