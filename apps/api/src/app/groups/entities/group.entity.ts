import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import { OAuthAccount } from "../../credentials/entities/credentials-account.entity"
import { Member } from "./member.entity"

@Entity("groups")
export class Group {
    @PrimaryColumn({ length: 32 })
    @Index({ unique: true })
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column({ name: "admin_id" })
    adminId: string

    @Column({ name: "tree_depth" })
    treeDepth: number

    @Column({
        name: "tree_root",
        nullable: true
    })
    treeRoot: number

    @Column({ name: "fingerprint_duration" })
    fingerprintDuration: number

    @OneToMany(() => Member, (member) => member.group, {
        cascade: ["insert"]
    })
    members: Member[]

    @OneToMany(() => OAuthAccount, (account) => account.group, {
        cascade: ["insert"]
    })
    oAuthAccounts: OAuthAccount[]

    @Column({
        type: "simple-json",
        name: "credentials",
        nullable: true
    })
    credentials: any // TODO: Add correct type for credentials JSON

    @Column({ name: "api_enabled", default: false })
    apiEnabled: boolean

    @Column({ name: "api_key", nullable: true })
    apiKey: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}
