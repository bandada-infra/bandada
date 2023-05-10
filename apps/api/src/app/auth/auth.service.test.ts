import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ethers } from "ethers"
import { generateNonce, SiweMessage } from "siwe"
import { Admin } from "../admins/entities/admin.entity"
import { AdminService } from "../admins/admins.service"
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
    let adminService: AdminService

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
            providers: [AuthService, AdminService]
        }).compile()

        authService = await module.resolve(AuthService)
        adminService = await module.resolve(AdminService)

        // Set API_URL so auth service can validate domain
        originalApiUrl = process.env.DASHBOARD_URL
        process.env.DASHBOARD_URL = mockDashboardUrl.toString()
        process.env.SIWE_STATEMENT =
            "You are using your Ethereum Wallet to sign in to Bandada."
    })

    afterAll(() => {
        process.env.DASHBOARD_URL = originalApiUrl
    })

    describe("# SIWE", () => {
        it("Should sign in and create a a new admin", async () => {
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

        it("Should sign in and return an existing admin", async () => {
            // Create a admin directly
            const admin2 = await adminService.create({
                id: "account2",
                address: account2.address
            })

            // Sign in with same address
            const message = createSiweMessage(account2.address)
            const signature = await account2.signMessage(message)

            const { admin } = await authService.signIn(
                {
                    message,
                    signature
                },
                nonce
            )

            expect(admin).toBeTruthy()
            expect(admin.address).toBe(admin2.address)
            expect(admin.address).toBe(account2.address)
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

        it("Should throw an error if the statement is invalid", async () => {
            // Use a custom message to sign
            const message = createSiweMessage(account1.address, "Sign in")
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn(
                    {
                        message: "invalid message",
                        signature
                    },
                    nonce
                )
            ).rejects.toThrow()
        })

        it("Should throw an error if the host is different", async () => {
            process.env.DASHBOARD_URL = "https://bandada2.test"

            // Use a custom message to sign
            const message = createSiweMessage(account1.address)
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn(
                    {
                        message: "invalid message",
                        signature
                    },
                    nonce
                )
            ).rejects.toThrow()
        })
    })
})
