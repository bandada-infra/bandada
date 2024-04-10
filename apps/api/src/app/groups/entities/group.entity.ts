import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import { OAuthAccount } from "../../credentials/entities/credentials-account.entity"
import { Member } from "./member.entity"
import { Invite } from "../../invites/entities/invite.entity"

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

    @ManyToMany(() => Member)
    @JoinTable({
        name: "memberships",
        joinColumn: {
            name: "group",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "member",
            referencedColumnName: "id"
        }
    })
    members: Member[]

    @OneToMany(() => Invite, (invite) => invite.group, {
        cascade: ["remove"]
    })
    invites: Invite[]

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

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}
