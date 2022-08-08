import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common"
import type { Response } from "express"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { AccountModel } from "../account/account.model"
import { AuthService } from "../auth/auth.service"

@Injectable()
export class TokenInterceptors implements NestInterceptor {
    constructor(private readonly authService: AuthService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<AccountModel>
    ): Observable<AccountModel> | Promise<Observable<AccountModel>> {
        return next.handle().pipe(
            map((account) => {
                const response = context.switchToHttp().getResponse<Response>()
                const token = this.authService.generateToken(account)

                response.setHeader("Authorization", `Bearer ${token}`)
                response.cookie("token", token, {
                    httpOnly: true,
                    signed: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production"
                })

                return account
            })
        )
    }
}
