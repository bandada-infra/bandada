import { Test, TestingModule } from "@nestjs/testing"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AccountModel } from "../account/account.model"

describe("AuthController", () => {
    let moduleRef: TestingModule
    let controller: AuthController

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        get: jest.fn(() => AccountModel)
                    }
                }
            ]
        }).compile()

        controller = moduleRef.get<AuthController>(AuthController)
    })

    it('should be defined"', () => {
        expect(controller).toBeDefined()
    })
})
