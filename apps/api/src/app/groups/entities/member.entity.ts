import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    Column,
    Index,
    Unique,
    JoinColumn
} from "typeorm"

import { Group } from "./group.entity"

@Entity("members")
@Unique(["id", "group"])
@Index(["id", "group"])
export class Member {
    @Column({ primary: true, unique: false })
    id: string

    // In reality the relation group -> members is many-to-many.
    // i.e we allow same member id to be part of many groups.
    // But since this property is not used in any feature at the moment,
    // it is treated as many-to-one in the code for simplicity.
    @ManyToOne(() => Group, (group) => group.members)
    @JoinColumn({ name: "group_id" })
    group: Group

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
