import { ReputationHandler } from "../types"

const handler: ReputationHandler = async (
    { minFollowers }: { minFollowers: number },
    { utils }
) => {
    const { followers } = await utils.githubAPI("/user")

    return followers > minFollowers
}

export default handler
