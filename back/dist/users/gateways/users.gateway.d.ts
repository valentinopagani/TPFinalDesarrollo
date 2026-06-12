import { ExternalUser } from "../user.types";
export declare const USERS_GATEWAY = "USERS_GATEWAY";
export interface UsersGateway {
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser>;
}
