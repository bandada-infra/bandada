import { ObjectId } from "mongodb"
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ObjectIdColumn,
    OneToOne
} from "typeorm"
import { GroupData } from "../../groups/entities/group.entity"

@Entity("invites")
export class Invite {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    @Index({ unique: true })
    code: string

    @Column({ default: false })
    redeemed: boolean

    @OneToOne(() => GroupData)
    @JoinColumn()
    group: GroupData
}
