import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ethers } from "ethers"
import { generateNonce, SiweMessage } from "siwe"
import { Admin } from "../admins/entities/admin.entity"
import { AdminsService } from "../admins/admins.service"
import { AuthService } from "./auth.service"

jest.mock("@bandada/utils", () => ({
    __esModule: true,
    getBandadaContract: () => ({
        updateGroups: jest.fn(() => ({
            status: true,
            logs: ["1"]
        })),
        getGroups: jest.fn(() => [])
    })
}))

const account1 = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
)

const account2 = new ethers.Wallet(
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
)

const mockDashboardUrl = new URL("https://bandada.test")

const nonce = generateNonce()

function createSiweMessage(address: string, statement?: string) {
    const message = new SiweMessage({
        domain: mockDashboardUrl.host,
        address,
        nonce,
        statement:
            statement ||
            "You are using your Ethereum Wallet to sign in to Bandada.",
        uri: mockDashboardUrl.origin,
        version: "1",
        chainId: 1
    })

    return message.prepareMessage()
}

describe("AuthService", () => {
    let authService: AuthService
    let adminsService: AdminsService

    let originalApiUrl: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [Admin],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([Admin])
            ],
            providers: [AuthService, AdminsService]
        }).compile()

        authService = await module.resolve(AuthService)
        adminsService = await module.resolve(AdminsService)

        // Set API_URL so auth service can validate domain
        originalApiUrl = process.env.DASHBOARD_URL
        process.env.DASHBOARD_URL = mockDashboardUrl.toString()
        process.env.SIWE_STATEMENT =
            "You are using your Ethereum Wallet to sign in to Bandada."
    })

    afterAll(() => {
        process.env.DASHBOARD_URL = originalApiUrl
    })

    describe("# signIn", () => {
        it("Should sign in and create a new admin", async () => {
            const message = createSiweMessage(account1.address)
            const signature = await account1.signMessage(message)

            const { admin } = await authService.signIn(
                {
                    message,
                    signature
                },
                nonce
            )

            expect(admin).toBeTruthy()
            expect(admin.address).toBe(account1.address)
        })

        it("Should throw an error if the signature is invalid", async () => {
            const message = createSiweMessage(account1.address)

            // Sign the message with a different account
            const signature = await account2.signMessage(message)

            await expect(
                authService.signIn(
                    {
                        message,
                        signature
                    },
                    nonce
                )
            ).rejects.toThrow()
        })

        it("Should throw an error if the host is different", async () => {
            process.env.DASHBOARD_URL = "https://bandada2.test"

            const message = createSiweMessage(account1.address)
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn(
                    {
                        message,
                        signature
                    },
                    nonce
                )
            ).rejects.toThrow("Invalid domain used in the SIWE message")
        })

        it("Should throw an error the nonce is different", async () => {
            const message = createSiweMessage(account1.address)
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn(
                    {
                        message,
                        signature
                    },
                    "1"
                )
            ).rejects.toThrow("Invalid nonce")
        })

        it("Should throw an error if the message is not the right one", async () => {
            const message = createSiweMessage(
                account1.address,
                "Another statement"
            )
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn(
                    {
                        message,
                        signature
                    },
                    nonce
                )
            ).rejects.toThrow("Invalid statement used in the SIWE message")
        })
    })

    describe("# isLoggedIn", () => {
        it("Should return true if the admin exists", async () => {
            const admin = await adminsService.findOne({
                address: account1.address
            })

            const response = await authService.isLoggedIn(admin.id)

            expect(response).toBeTruthy()
        })

        it("Should return false if the admin does not exist", async () => {
            const response = await authService.isLoggedIn("1234")

            expect(response).toBeFalsy()
        })
    })
})
