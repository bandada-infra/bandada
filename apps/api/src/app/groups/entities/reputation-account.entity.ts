import {
    PrimaryColumn,
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

    @ManyToOne(() => Group, (group) => group.reputationAccounts)
    @JoinColumn({ name: "group_id" })
    group: Group
}
