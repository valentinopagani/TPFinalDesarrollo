import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (cfg: ConfigService) => ({
				secret: cfg.getOrThrow<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: Number(cfg.get<string>('JWT_EXPIRES_SEC') ?? '3600'),
				},
			}),
		}),
		TypeOrmModule.forFeature([UserEntity]),
	],
	providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
	exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
