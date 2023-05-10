import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Admin } from "./entities/admin.entity"
import { AdminService } from "./admins.service"

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    exports: [AdminService],
    providers: [AdminService],
    controllers: []
})
export class AdminsModule {}
