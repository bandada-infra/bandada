import addProvider from "./addProvider"
import addProviders from "./addProviders"
import addValidator from "./addValidator"
import addValidators from "./addValidators"
import getProvider from "./getProvider"
import getValidator from "./getValidator"
import providers from "./providers"
import validators from "./validators"

describe("Credentials library", () => {
    describe("# addProvider", () => {
        it("Should add a provider to the list of supported providers", () => {
            addProvider({} as any)

            expect(providers).toHaveLength(5)
        })
    })

    describe("# addProviders", () => {
        it("Should add 2 providers to the list of supported providers", () => {
            addProviders([{} as any, {} as any])

            expect(providers).toHaveLength(7)
        })
    })

    describe("# addValidator", () => {
        it("Should add a validator to the list of supported validators", () => {
            addValidator({} as any)

            expect(validators).toHaveLength(9)
        })
    })

    describe("# addValidators", () => {
        it("Should add 2 validators to the list of supported validators", () => {
            addValidators([{} as any, {} as any])

            expect(validators).toHaveLength(11)
        })
    })

    describe("# getProvider", () => {
        it("Should return an existing provider", () => {
            const provider = getProvider("github")

            expect(provider).toBeDefined()
        })

        it("Should not return an existing provider if it does not exist", () => {
            const fun = () => getProvider("reddit")

            expect(fun).toThrow(`Provider 'reddit' does not exist`)
        })
    })

    describe("# getValidators", () => {
        it("Should return an existing validator", () => {
            const validator = getValidator("GITHUB_FOLLOWERS")

            expect(validator).toBeDefined()
        })

        it("Should not return an existing validator if it does not exist", () => {
            const fun = () => getValidator("EEE")

            expect(fun).toThrow(`Validator 'EEE' does not exist`)
        })
    })
})
