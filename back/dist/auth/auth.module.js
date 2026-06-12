"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    secret: cfg.getOrThrow('JWT_SECRET'),
                    signOptions: {
                        expiresIn: Number(cfg.get('JWT_EXPIRES_SEC') ?? '3600'),
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
        ],
        providers: [jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
        exports: [jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map