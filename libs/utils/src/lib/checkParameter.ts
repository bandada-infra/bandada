export default function checkParameter(value: any, name: string, type: string) {
    if (value === undefined) {
        throw new TypeError(`Parameter '${name}' is not defined`)
    }

    if (typeof value !== type) {
        throw new TypeError(`Parameter '${name}' is not a ${type}`)
    }
}
