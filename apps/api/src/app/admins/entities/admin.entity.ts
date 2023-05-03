import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm"

@Entity("admins")
export class Admin {
    @PrimaryColumn({ unique: true })
    id: string

    // Wallet address of the admin when using SIWE
    @Column({ unique: true })
    address: string

    @Column({ unique: true })
    username: string

    @CreateDateColumn()
    createdAt: Date
}
