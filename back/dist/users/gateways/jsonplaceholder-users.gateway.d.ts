import { ExternalUser } from "../user.types";
import { UsersGateway } from "./users.gateway";
export declare class JsonPlaceholderUsersGateway implements UsersGateway {
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser>;
}
