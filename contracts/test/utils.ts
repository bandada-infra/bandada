import { Identity } from "@semaphore-protocol/identity"
import { utils } from "ethers"

export const SNARK_SCALAR_FIELD = BigInt(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
)

export function createOffchainGroupId(name: string): bigint {
    return (
        BigInt(
            utils.solidityKeccak256(["string", "bytes32"], ["Offchain_", name])
        ) % SNARK_SCALAR_FIELD
    )
}

export function createIdentityCommitments(n: number): bigint[] {
    const identityCommitments: bigint[] = []

    for (let i = 0; i < n; i++) {
        const identity = new Identity(i.toString())
        const identityCommitment = identity.getCommitment()

        identityCommitments.push(identityCommitment)
    }

    return identityCommitments
}
