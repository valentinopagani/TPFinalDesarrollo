import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersRepo;
    constructor(cfg: ConfigService, usersRepo: Repository<UserEntity>);
    validate(payload: {
        sub: string;
    }): Promise<{
        id: string;
        email: string;
        role: import("../../users/user-role.enum").UserRole;
    }>;
}
export {};
