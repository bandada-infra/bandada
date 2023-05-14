import {
    PrimaryColumn,
    CreateDateColumn,
    Entity,
    ManyToOne,
    Unique,
    Index,
    JoinColumn
} from "typeorm"

import { Group } from "./group.entity"

@Entity("reputation_accounts")
@Index(["accountHash", "group"])
@Unique(["accountHash", "group"])
export class ReputationAccount {
    @PrimaryColumn()
    accountHash: string

    @ManyToOne(() => Group)
    @JoinColumn({ name: "group_id" })
    group: Group

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
