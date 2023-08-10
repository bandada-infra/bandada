import {
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Unique
} from "typeorm"
import { Group } from "../../groups/entities/group.entity"

@Entity("oauth_accounts")
@Index(["accountHash", "group"])
@Unique(["accountHash", "group"])
export class OAuthAccount {
    @PrimaryColumn()
    accountHash: string

    @ManyToOne(() => Group, (group) => group.oAuthAccounts, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "group_id" })
    group: Group
}
