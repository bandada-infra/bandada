import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn
} from "typeorm"

@Entity("groups")
export class GroupData {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({ unique: true })
    index: number

    @Column()
    @Index({ unique: true })
    name: string

    @Column()
    description: string

    @Column()
    admin: string

    @Column()
    treeDepth: number

    @Column("text", { array: true })
    members: string[]

    @CreateDateColumn()
    createdAt: Date

    @Column({ default: 0 })
    tag: number
}
