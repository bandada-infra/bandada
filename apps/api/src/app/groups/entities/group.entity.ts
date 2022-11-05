import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn
} from "typeorm"

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

    @Column("simple-array")
    members: string[]

    @CreateDateColumn()
    createdAt: Date

    @Column({ default: 0 })
    tag: number
}
