import { useCallback } from "react"
import { environment } from "src/environments/environment"
import request from "src/utils/request"

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

            // TODO: update this URL with the client-app one.
            return `https://zk-groups.com/${code}`
        },
        []
    )

    return {
        generateMagicLink
    }
}
