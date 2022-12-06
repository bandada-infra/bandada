import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn
} from "typeorm"
import { ServiceType } from "../../auth/types"

@Entity("accounts")
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    service: ServiceType

    @Column()
    userId: string

    @Column()
    accessToken: string

    @Column({ nullable: true })
    refreshToken?: string

    @Column()
    @Index({ unique: true })
    username: string

    @Column({ nullable: true })
    fullName?: string

    @Column()
    avatarURL: string

    @CreateDateColumn()
    createdAt: Date
}
