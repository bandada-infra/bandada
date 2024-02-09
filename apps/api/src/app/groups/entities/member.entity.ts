import { CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm"

@Entity("members")
export class Member {
    @PrimaryColumn()
    @Index({ unique: true })
    id: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
