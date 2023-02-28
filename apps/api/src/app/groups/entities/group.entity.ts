import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryColumn
} from "typeorm"
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

    @Column()
    admin: string

    @Column()
    treeDepth: number

    @OneToMany(() => Member, (member) => member.group, {
        cascade: true
    })
    members: Member[]

    @CreateDateColumn()
    createdAt: Date

    @Column({ default: 0 })
    tag: number
}
