import { PrimaryColumn, CreateDateColumn, Entity, ManyToOne, Column, ManyToMany } from "typeorm"

import { Group } from "./group.entity"

@Entity("members")
export class Member {
    @PrimaryColumn()
    id: string

    @ManyToMany(() => Group, (group) => group.members)
    @Column({ name: "group_id" })
    group: Group

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
