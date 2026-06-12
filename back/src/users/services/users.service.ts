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

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly usersRepo: Repository<UserEntity>,
		private readonly jwtService: JwtService,
		private readonly cfg: ConfigService,
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

	// ── REGISTRO con bcrypt + rol inicial ────────────────────────────────────
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

		// Primer usuario → admin; los demás → user
		const countUsers = await this.usersRepo.count();
		const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

		const entity = this.usersRepo.create({
			email: email.trim().toLowerCase(),
			passwordHash,
			role,
		});

		const saved = await this.usersRepo.save(entity);

		// Generar JWT
		const access_token = this.jwtService.sign({
			sub: saved.id,
			role: saved.role,
		});

		// Devolver token + datos del usuario
		return {
			access_token,
			user: {
				id: saved.id,
				email: saved.email,
				role: saved.role,
				createdAt: saved.createdAt,
			},
		};
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
