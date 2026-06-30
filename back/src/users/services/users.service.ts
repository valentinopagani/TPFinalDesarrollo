import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';
import {
	ChangeEmailInput,
	ChangePasswordInput,
	DeleteAccountInput,
	SafeUser,
	toSafeUser,
	UpdateRoleInput,
} from '../user.types';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly usersRepo: Repository<UserEntity>,
		private readonly cfg: ConfigService,
	) {}

	async findAll(): Promise<SafeUser[]> {
		const users = await this.usersRepo.find();
		return users.map(toSafeUser);
	}

	async findOneById(id: string): Promise<SafeUser> {
		const user = await this.usersRepo.findOne({ where: { id } });
		if (!user)
			throw new NotFoundException(`Usuario con id ${id} no encontrado`);
		return toSafeUser(user);
	}

	async changePassword(userId: string, dto: ChangePasswordInput) {
		const user = await this.usersRepo
			.createQueryBuilder('u')
			.addSelect('u.passwordHash')
			.where('u.id = :id', { id: userId })
			.getOne();

		if (!user) throw new NotFoundException('Usuario no encontrado');

		const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
		if (!valid) throw new BadRequestException('Contraseña actual inválida');

		const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
		user.passwordHash = await bcrypt.hash(dto.newPassword, rounds);
		await this.usersRepo.save(user);

		return { message: 'Password updated' };
	}

	async changeEmail(userId: string, dto: ChangeEmailInput) {
		const user = await this.usersRepo
			.createQueryBuilder('u')
			.addSelect('u.passwordHash')
			.where('u.id = :id', { id: userId })
			.getOne();

		if (!user) throw new NotFoundException('Usuario no encontrado');

		const valid = await bcrypt.compare(dto.password, user.passwordHash);
		if (!valid) throw new BadRequestException('Contraseña actual inválida');

		const email = dto.newEmail.trim().toLowerCase();
		const existing = await this.usersRepo.findOne({ where: { email } });
		if (existing && existing.id !== userId) {
			throw new ConflictException('El email ya está en uso');
		}

		user.email = email;
		await this.usersRepo.save(user);

		return { message: 'Email updated' };
	}

	async changeRole(
		currentUserId: string,
		targetId: string,
		dto: UpdateRoleInput,
	) {
		// No se puede cambiar el propio rol
		if (currentUserId === targetId) {
			throw new ForbiddenException('Cannot change your own role');
		}

		const user = await this.usersRepo.findOne({ where: { id: targetId } });
		if (!user) throw new NotFoundException('Usuario no encontrado');

		// No se puede degradar al único admin restante
		if (user.role === UserRole.ADMIN && dto.role === UserRole.USER) {
			const admins = await this.usersRepo.count({
				where: { role: UserRole.ADMIN },
			});
			if (admins <= 1) {
				throw new ForbiddenException('Cannot demote the only admin');
			}
		}

		user.role = dto.role;
		return toSafeUser(user);
	}

	async deleteAccount(userId: string, dto: DeleteAccountInput) {
		const user = await this.usersRepo
			.createQueryBuilder('u')
			.addSelect('u.passwordHash')
			.where('u.id = :id', { id: userId })
			.getOne();

		if (!user) throw new NotFoundException('Usuario no encontrado');

		const valid = await bcrypt.compare(dto.password, user.passwordHash);
		if (!valid) throw new BadRequestException('Contraseña incorrecta');

		await this.usersRepo.remove(user);

		return { message: 'Cuenta eliminada' };
	}
}
