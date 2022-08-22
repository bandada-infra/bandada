import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm"
import { ServiceType } from "../auth/types"

@Entity("accounts")
export class AccountModel {
    @PrimaryGeneratedColumn()
    id: string
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
