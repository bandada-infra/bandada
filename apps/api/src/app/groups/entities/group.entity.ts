import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm"
import { Member } from "./member.entity"

@Entity("groups")
export class Group {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({ unique: true })
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
