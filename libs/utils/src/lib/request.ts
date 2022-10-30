import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

/* istanbul ignore next */
export async function request(
    url: string,
    config?: AxiosRequestConfig
): Promise<any> {
    const { data }: AxiosResponse<any> = await axios(url, {
        withCredentials: true,
        ...config
    })

    return data
}
