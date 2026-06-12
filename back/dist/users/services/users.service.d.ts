import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly usersRepo;
    private readonly jwtService;
    private readonly cfg;
    constructor(usersRepo: Repository<UserEntity>, jwtService: JwtService, cfg: ConfigService);
    findAll(): Promise<Omit<UserEntity, 'passwordHash'>[]>;
    findOneById(id: string): Promise<UserEntity>;
    register(email: string, plainPassword: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            createdAt: Date;
        };
    }>;
    login(email: string, plainPassword: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            createdAt: Date;
        };
    }>;
}
