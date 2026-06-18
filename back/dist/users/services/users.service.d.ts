import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
export declare class UsersService {
    private readonly usersRepo;
    private readonly jwtService;
    private readonly cfg;
    private readonly mailerService;
    constructor(usersRepo: Repository<UserEntity>, jwtService: JwtService, cfg: ConfigService, mailerService: MailerService);
    findAll(): Promise<Omit<UserEntity, 'passwordHash'>[]>;
    findOneById(id: string): Promise<UserEntity>;
    register(email: string, plainPassword: string): Promise<{
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
