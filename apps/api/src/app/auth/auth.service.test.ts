import { ScheduleModule } from "@nestjs/schedule"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Group } from "../groups/entities/group.entity"
import { Member } from "../groups/entities/member.entity"
import { GroupsService } from "../groups/groups.service"
import { AuthService } from "./auth.service"
import { User } from "../users/entities/user.entity"
import { SiweMessage } from "siwe"
import { ethers } from "ethers"
import { UserService } from "../users/users.service"
import { JwtModule, JwtService } from "@nestjs/jwt"

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

function createSiweMessage(address) {
    const message = new SiweMessage({
        domain: "bandada.test",
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: "https://bandada.test",
        version: "1",
        chainId: 1
    })

    return message.prepareMessage()
}

describe.only("AuthService", () => {
    let authService: AuthService
    let userService: UserService

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
    })
})
