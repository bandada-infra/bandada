import { PrimaryColumn, CreateDateColumn, Entity, ManyToOne, Column } from "typeorm"

import { Group } from "./group.entity"

@Entity("reputation_accounts")
export class ReputationAccount {
    @PrimaryColumn()
    accountHash: string

    @ManyToOne(() => Group, (group) => group.members,)
    @Column({ name: "group_id" })
    group: Group

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
