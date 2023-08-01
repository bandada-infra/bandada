/**
 * It shortens a number by returning a short string
 * that represent an approximation of the same
 * number with less characters.
 * @param n Number to be shortened.
 * @returns Short number.
 */
export default function shortenNumber(n: number) {
    if (n === 0) {
        return 0
    }

    const abbreviations = ["", "k", "m", "b", "t"]
    const magnitude = Math.floor(Math.log10(Math.abs(n)) / 3)

    let roundedNumber = (n / 10 ** (magnitude * 3)).toFixed(1)

    if (Number.isInteger(Number(roundedNumber))) {
        roundedNumber = Number(roundedNumber).toFixed(0)
    }

    return roundedNumber + abbreviations[magnitude]
}
