import {
    Column,
    CreateDateColumn,
    Entity,
} from "typeorm"

@Entity("accounts")
export class Account {
    @Column()
    id: string

    @Column()
    username: string

    @CreateDateColumn()
    createdAt: Date
}
