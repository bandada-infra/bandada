import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm"

@Entity("users")
export class User {
    @PrimaryColumn({ unique: true })
    id: string

    // Wallet address of the user when using SIWE
    @Column({ unique: true })
    address: string

    @Column({ unique: true })
    username: string

    @CreateDateColumn()
    createdAt: Date
}
