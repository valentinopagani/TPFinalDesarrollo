import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { UserRole } from './user-role.enum';
import { UserEntity } from './user.entity';

// Proyección pública del usuario: nunca expone passwordHash ni tokens internos
export type SafeUser = {
	id: string;
	email: string;
	role: UserRole;
	createdAt: Date;
};

export function toSafeUser(u: UserEntity): SafeUser {
	return {
		id: u.id,
		email: u.email,
		role: u.role,
		createdAt: u.createdAt,
	};
}

export type ExternalUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
};

export class RegisterInput {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(8)
	password!: string;
}

export class LoginInput {
	@IsEmail()
	email!: string;

	@IsString()
	password!: string;
}

export class VerifyEmailInput {
	@IsString()
	token!: string;
}

export class ForgotPasswordInput {
	@IsEmail()
	email!: string;
}

export class ResetPasswordInput {
	@IsString()
	token!: string;

	@IsString()
	@MinLength(8)
	newPassword!: string;
}

export class ChangePasswordInput {
	@IsString()
	currentPassword!: string;

	@IsString()
	@MinLength(8)
	newPassword!: string;
}

export class ChangeEmailInput {
	@IsEmail()
	newEmail!: string;

	@IsString()
	password!: string;
}

export class UpdateRoleInput {
	@IsIn([UserRole.USER, UserRole.ADMIN])
	role!: UserRole;
}

export class DeleteAccountInput {
	@IsString()
	password!: string;
}
