import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import { ReputationAccount } from "../../reputation/entities/reputation-account.entity"
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

    @Column({ name: "fingerprint_duration" })
    fingerprintDuration: number

    @OneToMany(() => Member, (member) => member.group, {
        cascade: ["insert"]
    })
    members: Member[]

    @OneToMany(() => ReputationAccount, (account) => account.group, {
        cascade: ["insert"]
    })
    reputationAccounts: ReputationAccount[]

    @Column({
        type: "simple-json",
        name: "reputation_criteria",
        nullable: true
    })
    reputationCriteria: any // TODO: Add correct type for reputationCriteria JSON

    @Column({ name: "api_enabled", default: false })
    apiEnabled: boolean

    @Column({ name: "api_key", nullable: true })
    apiKey: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}
