import { request } from "@zk-groups/utils"
import { useCallback } from "react"

type ReturnParameters = {
    generateMagicLink: (groupName: string) => Promise<string>
}

export default function useInvites(): ReturnParameters {
    const generateMagicLink = useCallback(
        async (groupName: string): Promise<string> => {
            const code = await request(`${process.env.NX_API_URL}/invites`, {
                method: "post",
                data: {
                    groupName
                }
            })

            return `${process.env.NX_CLIENT_URL}/invites/${code}`
        },
        []
    )

    return {
        generateMagicLink
    }
}
