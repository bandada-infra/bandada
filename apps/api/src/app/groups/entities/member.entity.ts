import {
    PrimaryColumn,
    CreateDateColumn,
    Entity,
    ManyToOne,
} from "typeorm"

import { Group } from "./group.entity"

@Entity("members")
export class Member {
    @PrimaryColumn()
    id: string

    @ManyToOne(() => Group, (group) => group.members)
    group: Group

    @CreateDateColumn()
    createdAt: Date
}
