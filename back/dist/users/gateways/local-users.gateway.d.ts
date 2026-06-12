import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';
export declare class LocalUsersGateway implements UsersGateway {
    private users;
    constructor();
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser>;
}
