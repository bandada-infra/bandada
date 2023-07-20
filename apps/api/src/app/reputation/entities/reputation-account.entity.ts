import {
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Unique
} from "typeorm"
import { Group } from "../../groups/entities/group.entity"

@Entity("reputation_accounts")
@Index(["accountHash", "group"])
@Unique(["accountHash", "group"])
export class ReputationAccount {
    @PrimaryColumn()
    accountHash: string

    @ManyToOne(() => Group, (group) => group.reputationAccounts, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "group_id" })
    group: Group
}
