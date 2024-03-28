import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"

@Entity("admins")
@Index(["apiKey"], { unique: true })
export class Admin {
    @PrimaryColumn({ unique: true })
    id: string

    // Wallet address of the admin when using SIWE
    @Column({ unique: true })
    address: string

    @Column({ unique: true })
    username: string

    @Column({ name: "api_key", nullable: true })
    apiKey: string

    @Column({ name: "api_enabled", default: false })
    apiEnabled: boolean

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}
