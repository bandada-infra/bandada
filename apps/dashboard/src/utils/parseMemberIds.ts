/**
 * Parses a string of comma or space separated member ids into an array of member ids.
 * @param input String of comma or space separated member ids.
 * @returns Array of member ids.
 */
export default function parseMemberIds(input: string): string[] {
    return input.split(/[ ,]+/).filter(Boolean)
}
