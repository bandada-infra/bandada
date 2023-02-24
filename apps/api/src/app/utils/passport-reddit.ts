/* eslint-disable @typescript-eslint/naming-convention */
import {
    InternalOAuthError,
    Strategy as OAuth2Strategy,
    StrategyOptions,
    VerifyFunction
} from "passport-oauth2"
import { stringify } from "querystring"

export type Profile = {
    id: string
    name: string
    icon_img: string
    subreddit: {
        title: string
    }
}

export default class Strategy extends OAuth2Strategy {
    public name = "reddit"

    private _userProfileURL = "https://oauth.reddit.com/api/v1/me"

    constructor(redditOptions: any, verify: VerifyFunction) {
        const options: StrategyOptions = {
            authorizationURL: "https://ssl.reddit.com/api/v1/authorize",
            tokenURL: "https://ssl.reddit.com/api/v1/access_token",
            ...redditOptions
        }

        if (options.scope) {
            if (Array.isArray(options.scope)) {
                options.scope.push("identity")
                options.scopeSeparator = ","
            } else {
                options.scope = options.scope
                    .split(",")
                    .reduce(
                        (previousValue, currentValue) => {
                            if (currentValue !== "")
                                previousValue.push(currentValue)
                            return previousValue
                        },
                        ["identity"]
                    )
                    .join(",")
            }
        } else {
            options.scope = "identity"
        }

        if (
            typeof options.state === "undefined" &&
            typeof options.store === "undefined"
        ) {
            options.state = true
        }

        super(options, verify)

        this._oauth2.useAuthorizationHeaderforGET(true)

        this._oauth2.getOAuthAccessToken = function (
            code: string,
            params: any,
            callback: any
        ) {
            params = params || {}
            params.type = "web_server"
            const codeParam =
                params.grant_type === "refresh_token" ? "refresh_token" : "code"
            params[codeParam] = code

            const post_data = stringify(params)
            const authorization = `Basic ${Buffer.from(
                `${this._clientId}:${this._clientSecret}`,
                "utf8"
            ).toString("base64")}`
            const post_headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: authorization
            }

            this._request(
                "POST",
                this._getAccessTokenUrl(),
                post_headers,
                post_data,
                null,
                (error: any, data: any) => {
                    if (error) {
                        callback(error)
                    } else {
                        const results = JSON.parse(data)
                        const { access_token } = results
                        const { refresh_token } = results

                        delete results.refresh_token

                        callback(null, access_token, refresh_token, results)
                    }
                }
            )
        } as any
    }

    userProfile(
        accessToken: string,
        done: (err?: Error | null, profile?: any) => void
    ) {
        this._oauth2.get(
            this._userProfileURL,
            accessToken,
            (err: { statusCode: number; data?: any }, result: string) => {
                if (err) {
                    return done(
                        new InternalOAuthError(
                            "Failed to fetch user profile",
                            err
                        )
                    )
                }

                try {
                    done(null, JSON.parse(result))
                } catch (error) {
                    done(error)
                }
            }
        )
    }
}
