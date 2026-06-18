import {
	Inject,
	Injectable,
	UnauthorizedException,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly usersRepo: Repository<UserEntity>,
		private readonly jwtService: JwtService,
		private readonly cfg: ConfigService,
		private readonly mailerService: MailerService,
	) {}

	async findAll(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
		return this.usersRepo.find();
	}

	async findOneById(id: string): Promise<UserEntity> {
		const user = await this.usersRepo.findOne({ where: { id } });
		if (!user)
			throw new NotFoundException(`Usuario con id ${id} no encontrado`);
		return user;
	}

	// ── REGISTRO con bcrypt + rol inicial + verificación por email ────────────
	async register(email: string, plainPassword: string) {
		// Verificar email duplicado
		const exists = await this.usersRepo.findOne({
			where: { email: email.trim().toLowerCase() },
		});
		if (exists) {
			throw new ConflictException('El email ya está registrado');
		}

		// Hashear contraseña
		const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
		const passwordHash = await bcrypt.hash(plainPassword, rounds);

		// Primer usuario es admin los demás user
		const countUsers = await this.usersRepo.count();
		const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

		// generar token único de verificación ──
		const verificationToken = randomUUID();

		const entity = this.usersRepo.create({
			email: email.trim().toLowerCase(),
			passwordHash,
			role,
			verificationToken, // guardarlo en la entidad
			isVerified: false,
		});
		const saved = await this.usersRepo.save(entity);

		// enviar email con el link de verificación ──
		const appUrl = this.cfg.get<string>('APP_URL');
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
					// ver que hacer en caso de error
			})

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

	// verificar token
	async verifyEmail(token: string) {
		const user = await this.usersRepo.findOne({
			where: { verificationToken: token },
		});

		if (!user) {
			throw new NotFoundException('Token inválido o ya utilizado');
		}

		user.isVerified = true;
		user.verificationToken = null; // invalidar despues de usarlo
		await this.usersRepo.save(user);

		return { message: 'Email verificado correctamente' };
	}

	// ── LOGIN con bcrypt.compare ──────────────────────────────────────────────
	async login(email: string, plainPassword: string) {
		const user = await this.usersRepo
			.createQueryBuilder('u')
			.addSelect('u.passwordHash')
			.where('u.email = :email', { email: email.trim().toLowerCase() })
			.getOne();

		const INVALID = 'Credenciales inválidas';
		if (!user) throw new UnauthorizedException(INVALID);

		const ok = await bcrypt.compare(plainPassword, user.passwordHash);
		if (!ok) throw new UnauthorizedException(INVALID);

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
}
