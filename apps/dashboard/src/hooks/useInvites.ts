import { request } from "@zk-groups/utils"
import { useCallback } from "react"

type ReturnParameters = {
    generateMagicLink: (groupId: string) => Promise<string>
}

export default function useInvites(): ReturnParameters {
    const generateMagicLink = useCallback(
        async (groupId: string): Promise<string> => {
            const code = await request(
                `${import.meta.env.VITE_API_URL}/invites`,
                {
                    method: "post",
                    data: {
                        groupId
                    }
                }
            )

            return `${import.meta.env.VITE_CLIENT_URL}/invites/${code}`
        },
        []
    )

    return {
        generateMagicLink
    }
}
