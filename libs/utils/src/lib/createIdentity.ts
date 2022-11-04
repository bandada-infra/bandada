import { Identity } from "@semaphore-protocol/identity"
import checkParameter from "./checkParameter"

export async function createIdentity(
    sign: (message: string) => Promise<string>,
    groupName: string,
    nonce = 0
): Promise<Identity> {
    checkParameter(sign, "sign", "function")
    checkParameter(groupName, "groupName", "string")
    checkParameter(nonce, "nonce", "number")

    const message = await sign(
        `Sign this message to generate your ${groupName} Semaphore identity with key nonce: ${nonce}.`
    )

    return new Identity(message)
}
