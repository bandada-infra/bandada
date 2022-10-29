import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectID,
    ObjectIdColumn
} from "typeorm"
import { ServiceType } from "../auth/types"

@Entity("accounts")
export class AccountModel {
    @ObjectIdColumn()
    id: ObjectID
    @Column()
    service: ServiceType
    @Column()
    userId: string
    @Column()
    accessToken: string
    @Column()
    refreshToken: string
    @Column()
    username: string
    @Column()
    fullName: string
    @Column()
    avatarURL: string
    @CreateDateColumn()
    createdAt: Date
}
