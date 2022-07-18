import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"

@Injectable()
export class CookieSerializer extends PassportSerializer {
    serializeUser(user, done: (a, b) => void) {
        done(null, user)
    }

    deserializeUser(payload, done: (a, b) => void) {
        done(null, payload)
    }
}
