import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"

@Entity()
export class UserModel {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    email: string
}
