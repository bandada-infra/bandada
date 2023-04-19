import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SiweMessage } from "siwe"
import { ethers } from "ethers"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { User } from "../users/entities/user.entity"
import { UserService } from "../users/users.service"

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

function createSiweMessage(address, statement?: string) {
    const message = new SiweMessage({
        domain: mockDashboardUrl.host,
        address,
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
    let userService: UserService

    let originalApiUrl: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: "sqlite",
                        database: ":memory:",
                        dropSchema: true,
                        entities: [User],
                        synchronize: true
                    })
                }),
                TypeOrmModule.forFeature([User]),
                JwtModule.register({
                    secret: "s3cret",
                    signOptions: { expiresIn: "300s" }
                })
            ],
            providers: [AuthService, UserService]
        }).compile()

        authService = await module.resolve(AuthService)
        userService = await module.resolve(UserService)

        // Set API_URL so auth service can validate domain
        originalApiUrl = process.env.DASHBOARD_URL
        process.env.DASHBOARD_URL = mockDashboardUrl.toString()
    })

    afterAll(() => {
        process.env.DASHBOARD_URL = originalApiUrl
    })

    describe("# SIWE", () => {
        it("Should sign in and generate token for a new user", async () => {
            const message = await createSiweMessage(account1.address)
            const signature = await account1.signMessage(message)

            const { user, token } = await authService.signIn({
                message,
                signature
            })

            expect(user).toBeTruthy()
            expect(user.address).toBe(account1.address)
            expect(token).toBeTruthy()
        })

        it("Should sign in and generate token for an existing user", async () => {
            // Create a user directly
            const user2 = await userService.create({
                id: "account2",
                address: account2.address
            })

            // Sign in with same address
            const message = await createSiweMessage(account2.address)
            const signature = await account2.signMessage(message)

            const { user, token } = await authService.signIn({
                message,
                signature
            })

            expect(user).toBeTruthy()
            expect(token).toBeTruthy()
            expect(user.address).toBe(user2.address)
            expect(user.address).toBe(account2.address)
        })

        it("Should throw an error if the signature is invalid", async () => {
            const message = await createSiweMessage(account1.address)

            // Sign the message with a different account
            const signature = await account2.signMessage(message)

            await expect(
                authService.signIn({
                    message,
                    signature
                })
            ).rejects.toThrow()
        })

        it("Should throw an error if the statement is invalid", async () => {
            // Use a custom message to sign
            const message = await createSiweMessage(account1.address, "Sign in")
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn({
                    message: "invalid message",
                    signature
                })
            ).rejects.toThrow()
        })

        it("Should throw an error if the host is different", async () => {
            process.env.DASHBOARD_URL = "https://bandada2.test"

            // Use a custom message to sign
            const message = await createSiweMessage(account1.address)
            const signature = await account1.signMessage(message)

            await expect(
                authService.signIn({
                    message: "invalid message",
                    signature
                })
            ).rejects.toThrow()
        })
    })
})
