import { request } from "@zk-groups/utils"
import { useCallback } from "react"
import { environment } from "../environments/environment"

type ReturnParameters = {
    generateMagicLink: (groupName: string) => Promise<string>
}

export default function useInvites(): ReturnParameters {
    const generateMagicLink = useCallback(
        async (groupName: string): Promise<string> => {
            const code = await request(`${environment.apiUrl}/invites`, {
                method: "post",
                data: {
                    groupName
                }
            })

            return `${environment.clientUrl}/invites/${code}`
        },
        []
    )

    return {
        generateMagicLink
    }
}
