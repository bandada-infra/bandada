import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Admin } from "./entities/admin.entity"
import { AdminsService } from "./admins.service"
import { AdminsController } from "./admins.controller"

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    exports: [AdminsService],
    providers: [AdminsService],
    controllers: [AdminsController]
})
export class AdminsModule {}
