import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET_KEY
        })
    }

    async validate(payload: Payload, done: VerifiedCallback) {
        const user = await this.authService.tokenValidateAccount(payload);

        if(!user) {
            return done(new UnauthorizedException({message: 'Account does not found'}), false);
        }

        return done(null, user);
    }
}