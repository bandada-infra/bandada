import { IsEnum, IsString } from "class-validator"
import { ApiKeyActions } from "@bandada/utils"

export class UpdateApiKeyDTO {
    @IsString()
    adminId: string

    @IsEnum(ApiKeyActions)
    action: ApiKeyActions
}
