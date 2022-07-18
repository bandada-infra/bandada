import { PartialType } from "@nestjs/mapped-types"
import { CreateAccountDTO } from "./create-account.dto"

export class UpdateAccountDTO extends PartialType(CreateAccountDTO) {}
