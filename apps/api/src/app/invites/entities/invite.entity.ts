/* istanbul ignore file */
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
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
    isRedeemed: boolean

    @ManyToOne(() => Group, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "group_id" })
    group: Group

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
