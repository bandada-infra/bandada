import { IsEnum, IsString } from "class-validator"
import { ApiKeyActions } from "../../../types"

export class UpdateApiKeyDTO {
    @IsString()
    adminId: string

    @IsEnum(ApiKeyActions)
    action: ApiKeyActions
}
