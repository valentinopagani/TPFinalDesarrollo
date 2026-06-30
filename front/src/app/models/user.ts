export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isVerified: boolean;
}

export type UserRole = 'user' | 'admin';

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailDto {
  newEmail: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}
