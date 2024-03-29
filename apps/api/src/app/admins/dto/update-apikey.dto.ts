import { ApiKeyActions } from "@bandada/utils"
import { IsEnum } from "class-validator"

export class UpdateApiKeyDTO {
    @IsEnum(ApiKeyActions)
    action: ApiKeyActions
}
