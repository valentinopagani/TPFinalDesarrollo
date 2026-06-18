"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./controllers/users.controller");
const jsonplaceholder_users_gateway_1 = require("./gateways/jsonplaceholder-users.gateway");
const local_users_gateway_1 = require("./gateways/local-users.gateway");
const users_gateway_1 = require("./gateways/users.gateway");
const users_service_1 = require("./services/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const auth_module_1 = require("../auth/auth.module");
const mail_module_1 = require("../mails/mail.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]), auth_module_1.AuthModule, mail_module_1.MailsModule],
        controllers: [users_controller_1.AuthController, users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            {
                provide: users_gateway_1.USERS_GATEWAY,
                useFactory: () => {
                    return process.env.USERS_SOURCE === 'local'
                        ? new local_users_gateway_1.LocalUsersGateway()
                        : new jsonplaceholder_users_gateway_1.JsonPlaceholderUsersGateway();
                },
            },
        ],
        exports: [users_service_1.UsersService, users_gateway_1.USERS_GATEWAY],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map