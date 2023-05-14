/* istanbul ignore file */
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm"
import { Group } from "../../groups/entities/group.entity"

@Entity("invites")
export class Invite {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({ unique: true })
    code: string

    @Column({ default: false, name: "is_redeemed" })
    isRedeemed?: boolean

    @ManyToOne(() => Group)
    group: Group
}
