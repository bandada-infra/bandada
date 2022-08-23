import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity()
export class GroupData {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    @Index({unique: true})
    index: number;

    @Column()
    @Index({unique: true})
    name: string;

    @Column()
    description: string;

    @Column()
    admin: string; // @todo: change the admin property

    @Column()
    treeDepth: number;

    @Column({default:[]})
    members: string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: string;

    @Column({default:0})
    tag: number;
} 