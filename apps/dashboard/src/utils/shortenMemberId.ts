export default function shortenMemberId(memberId: string, chars = 4) {
    return `${memberId.substring(0, chars)}...${memberId.substring(
        memberId.length - chars
    )}`
}
