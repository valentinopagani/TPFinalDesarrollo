import { MailerService } from '@nestjs-modules/mailer';
import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/users/user.entity';
import { UserRole } from 'src/users/user-role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly usersRepo: Repository<UserEntity>,
		private readonly jwtService: JwtService,
		private readonly cfg: ConfigService,
		private readonly mailerService: MailerService,
	) {}

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
		const frontUrl =
			this.cfg.get<string>('FRONT_URL') ?? 'http://localhost:4200';
		const verifyLink = `${frontUrl}/verify-email?token=${verificationToken}`;
		this.mailerService
			.sendMail({
				from: 'paganivalentino06@gmail.com',
				to: saved.email,
				subject: 'Verificá tu cuenta',
				html: `
		              <div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1;">
						<div style="max-width: 600px; margin: auto; padding: 16px;">
						<p style="text-align: center;"><strong><span style="font-size: 14pt;">Gracias por registrarte!</span></strong></p>
						<p>
							<span style="font-size: 12pt;">Hac&eacute; click en el siguiente botón para verificar tu cuenta:</span>
						</p>
						<a style="display: inline-block; text-decoration: none; outline: none; color: #fff; background-color: #fc0038; padding: 8px 16px; border-radius: 4px;" href="${verifyLink}" target="_blank" rel="noopener">Verificar mi Cuenta</a></div>
						<div style="max-width: 600px; margin: auto; padding: 16px;">
							Este link es de un solo uso!
							<br />
							<span style="color: #7e8c8d;">Equipo de Desarrollo de Software 2026.</span>
						</div>
					</div>
            `,
			})
			.catch((e) => {
				// ver que hacer en caso de error
			});

		// access_token al registrar (sección 4.1: register devuelve user + access_token)
		const access_token = this.jwtService.sign({
			sub: saved.id,
			role: saved.role,
		});

		return {
			user: {
				id: saved.id,
				email: saved.email,
				role: saved.role,
				createdAt: saved.createdAt,
			},
			access_token,
			verificationToken: saved.verificationToken,
		};
	}

	async resendVerificationEmail(email: string) {
		const user = await this.usersRepo.findOne({
			where: { email: email.trim().toLowerCase() },
		});

		if (!user) {
			throw new NotFoundException('Email no registrado');
		}

		if (user.isVerified) {
			return { message: 'Cuenta ya verificada' };
		}
		// generar nuevo token único
		const newToken = randomUUID();
		user.verificationToken = newToken;
		await this.usersRepo.save(user);

		// enviar nuevo correo
		const frontUrl =
			this.cfg.get<string>('FRONT_URL') ?? 'http://localhost:4200';
		const verifyLink = `${frontUrl}/verify-email?token=${newToken}`;

		await this.mailerService.sendMail({
			from: 'paganivalentino06@gmail.com',
			to: user.email,
			subject: 'Reenvío de verificación de cuenta',
			html: `
				<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1;">
					<div style="max-width: 600px; margin: auto; padding: 16px;">
					<p style="text-align: center;"><strong><span style="font-size: 14pt;">Hola ${user.email}!</span></strong></p>
					<p>
						<span style="font-size: 12pt;">Solicitaste reenviar el correo de verificación. Hacé clic en el siguiente enlace para verificar tu cuenta:</span>
					</p>
					<a style="display: inline-block; text-decoration: none; outline: none; color: #fff; background-color: #fc0038; padding: 8px 16px; border-radius: 4px;" href="${verifyLink}" target="_blank" rel="noopener">Verificar mi Cuenta</a></div>
					<div style="max-width: 600px; margin: auto; padding: 16px;">
						Este link es de un solo uso!
						<br />
						<span style="color: #7e8c8d;">Equipo de Desarrollo de Software 2026.</span>
					</div>
				</div>
			`,
		});

		return { message: 'Correo de verificación reenviado correctamente' };
	}

	// ── RECUPERACIÓN DE CONTRASEÑA ─────────────────────────────────────────

	async forgotPassword(email: string) {
		// Responder siempre el mismo mensaje por seguridad
		const SAFE_MSG = { message: 'Si el email existe, recibirás un link' };

		const user = await this.usersRepo.findOne({
			where: { email: email.trim().toLowerCase() },
		});

		if (!user) {
			return SAFE_MSG;
		}

		// generar token y expiración (1 hora)
		const token = randomUUID();
		const expires = new Date(Date.now() + 60 * 60 * 1000);
		user.resetPasswordToken = token;
		user.resetPasswordExpires = expires;
		await this.usersRepo.save(user);

		// enviar email con link al frontend
		const frontUrl =
			this.cfg.get<string>('FRONT_URL') ?? 'http://localhost:4200';
		const resetLink = `${frontUrl}/reset-password?token=${token}`;

		this.mailerService
			.sendMail({
				from: 'paganivalentino06@gmail.com',
				to: user.email,
				subject: 'Recuperá tu contraseña',
				html: `
						<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1;">
							<div style="max-width: 600px; margin: auto; padding: 16px;">
							<p style="text-align: center;"><strong><span style="font-size: 14pt;">Hola ${user.email}!</span></strong></p>
							<p>
								<span style="font-size: 12pt;">Hacé clic en el siguiente enlace para restablecer tu contraseña:</span>
							</p>
							<a style="display: inline-block; text-decoration: none; outline: none; color: #fff; background-color: #fc0038; padding: 8px 16px; border-radius: 4px;" href="${resetLink}" target="_blank" rel="noopener">Restablecer Contraseña</a></div>
							<div style="max-width: 600px; margin: auto; padding: 16px;">
								Este link es de un solo uso!
								<br />
								<span style="color: #7e8c8d;">Equipo de Desarrollo de Software 2026.</span>
							</div>
						</div>
				`,
			})
			.catch(() => {
				// swallow send errors
			});

		return SAFE_MSG;
	}

	async resetPassword(token: string, newPassword: string) {
		const user = await this.usersRepo.findOne({
			where: { resetPasswordToken: token },
		});

		if (
			!user ||
			!user.resetPasswordExpires ||
			user.resetPasswordExpires.getTime() < Date.now()
		) {
			throw new BadRequestException('Token inválido o expirado');
		}

		const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
		user.passwordHash = await bcrypt.hash(newPassword, rounds);
		user.resetPasswordToken = null;
		user.resetPasswordExpires = null;
		await this.usersRepo.save(user);

		return { message: 'Contraseña actualizada' };
	}

	// verificar token
	async verifyEmail(token: string) {
		const user = await this.usersRepo.findOne({
			where: { verificationToken: token },
		});

		if (!user) {
			throw new BadRequestException('Token inválido o expirado');
		}

		user.isVerified = true;
		user.verificationToken = null; // se limpia despues de usarlo
		await this.usersRepo.save(user);

		return { message: 'Email verificado' };
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

		// impedir login si el email no fue verificado
		if (!user.isVerified)
			throw new UnauthorizedException('Cuenta no verificada');

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

	async findOneById(id: string): Promise<UserEntity> {
		const user = await this.usersRepo.findOne({ where: { id } });
		if (!user)
			throw new NotFoundException(`Usuario con id ${id} no encontrado`);
		return user;
	}

}
