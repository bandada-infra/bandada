export class GroupData {
    id: number;
    name: string;
    description: string;
    admin: string; // @todo: change the admin property
    treeDepth: number;
    members: bigint[];
    createdAt: number;
}