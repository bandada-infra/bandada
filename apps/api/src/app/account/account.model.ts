import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"

@Entity()
export class AccountModel {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    service: string

    @Column({ generatedType: "STORED" })
    tokens: {
        accessToken: string
        userId: string
    }

    @Column()
    username: string

    @Column()
    fullName: string

    @Column()
    avatarURL: string

    @Column()
    signUpDate: Date
}
