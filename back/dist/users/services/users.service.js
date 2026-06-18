"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../user.entity");
const user_role_enum_1 = require("../user-role.enum");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const mailer_1 = require("@nestjs-modules/mailer");
let UsersService = class UsersService {
    usersRepo;
    jwtService;
    cfg;
    mailerService;
    constructor(usersRepo, jwtService, cfg, mailerService) {
        this.usersRepo = usersRepo;
        this.jwtService = jwtService;
        this.cfg = cfg;
        this.mailerService = mailerService;
    }
    async findAll() {
        return this.usersRepo.find();
    }
    async findOneById(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
        return user;
    }
    async register(email, plainPassword) {
        const exists = await this.usersRepo.findOne({
            where: { email: email.trim().toLowerCase() },
        });
        if (exists) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        const passwordHash = await bcrypt.hash(plainPassword, rounds);
        const countUsers = await this.usersRepo.count();
        const role = countUsers === 0 ? user_role_enum_1.UserRole.ADMIN : user_role_enum_1.UserRole.USER;
        const verificationToken = (0, crypto_1.randomUUID)();
        const entity = this.usersRepo.create({
            email: email.trim().toLowerCase(),
            passwordHash,
            role,
            verificationToken,
            isVerified: false,
        });
        const saved = await this.usersRepo.save(entity);
        const appUrl = this.cfg.get('APP_URL');
        const verifyLink = `${appUrl}/auth/verify?token=${verificationToken}`;
        this.mailerService.sendMail({
            from: 'paganivalentino06@gmail.com',
            to: saved.email,
            subject: 'Verificá tu cuenta',
            html: `
      <p>Gracias por registrarte. Hacé clic en el siguiente link para verificar tu cuenta:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>Este link es de un solo uso.</p>
    `,
        }).catch(e => {
        });
        return {
            message: 'Registro exitoso. Revisá tu email para verificar tu cuenta.',
            user: {
                id: saved.id,
                email: saved.email,
                role: saved.role,
                createdAt: saved.createdAt,
            },
        };
    }
    async verifyEmail(token) {
        const user = await this.usersRepo.findOne({
            where: { verificationToken: token },
        });
        if (!user) {
            throw new common_1.NotFoundException('Token inválido o ya utilizado');
        }
        user.isVerified = true;
        user.verificationToken = null;
        await this.usersRepo.save(user);
        return { message: 'Email verificado correctamente' };
    }
    async login(email, plainPassword) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.email = :email', { email: email.trim().toLowerCase() })
            .getOne();
        const INVALID = 'Credenciales inválidas';
        if (!user)
            throw new common_1.UnauthorizedException(INVALID);
        const ok = await bcrypt.compare(plainPassword, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException(INVALID);
        const access_token = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        mailer_1.MailerService])
], UsersService);
//# sourceMappingURL=users.service.js.map