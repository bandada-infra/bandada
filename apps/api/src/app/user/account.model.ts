import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"

@Entity()
export class AccountModel {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    email: string
}
