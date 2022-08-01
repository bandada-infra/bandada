import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { GroupsModule } from './groups/groups.module';

@Module({
    imports: [
        GroupsModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
