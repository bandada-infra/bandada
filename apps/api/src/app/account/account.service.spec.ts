import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { AccountModel } from "./account.model"
import { AccountService } from "./account.service"

describe("AccountService", () => {
    let service: AccountService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                {
                    provide: getRepositoryToken(AccountModel),
                    useValue: {}
                }
            ]
        }).compile()

        service = module.get<AccountService>(AccountService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
