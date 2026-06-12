import { UserRole } from './user-role.enum';
export declare class UserEntity {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
}
