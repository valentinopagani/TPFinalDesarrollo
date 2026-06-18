import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';
@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;
	@Column({ unique: true })
	email!: string;
	@Column({ select: false })
	passwordHash!: string;
	@Column({ type: 'text', default: UserRole.USER })
	role!: UserRole;
	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	createdAt!: Date;
	@Column({ type: 'text', nullable: true })
	verificationToken!: string | null;
	@Column({ default: false })
	isVerified!: boolean;
}
