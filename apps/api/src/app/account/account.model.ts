import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm"

@Entity("accounts")
export class AccountModel {
    @PrimaryGeneratedColumn()
    id: string
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
    @CreateDateColumn()
    signUpDate: Date
}
