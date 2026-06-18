import { UsersService } from '../services/users.service';
import { UserRole } from '../user-role.enum';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            createdAt: Date;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            createdAt: Date;
        };
    }>;
    findMe(req: any): Promise<{
        id: string;
        email: string;
        role: UserRole;
        createdAt: Date;
        verificationToken: string | null;
        isVerified: boolean;
    }>;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<import("../user.entity").UserEntity, "passwordHash">[]>;
    findOne(id: string): Promise<import("../user.entity").UserEntity>;
}
