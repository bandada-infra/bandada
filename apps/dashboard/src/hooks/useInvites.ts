import { AxiosRequestConfig } from "axios"
import { useCallback } from "react"
import { environment } from "src/environments/environment"
import request from "src/utils/request"

type ReturnParameters = {
    generateMagicLink: (groupName: string) => Promise<string>
}

export default function useInvites(): ReturnParameters {
    const generateMagicLink = useCallback(
        async (groupName: string): Promise<string> => {
            const config: AxiosRequestConfig = {
                method: "post",
                data: {
                    groupName
                }
            }

            const code = await request(`${environment.apiUrl}/invites`, config)

            return `https://zk-groups.com/${code}`
        },
        []
    )

    return {
        generateMagicLink
    }
}
