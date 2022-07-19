import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { ObjectID } from "typeorm"
import { AccountModel } from "../../account/account.model"
import { AccountService } from "../../account/account.service"

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly accountService: AccountService) {
        super()
    }

    serializeUser(
        account: AccountModel,
        done: (error: Error, account: { id: ObjectID }) => void
    ) {
        done(null, { id: account.id })
    }

    async deserializeUser(
        payload: { id: ObjectID },
        done: (error: Error, account: AccountModel) => void
    ) {
        const user = await this.accountService.findOne({ id: payload.id })
        done(null, user)
    }
}
