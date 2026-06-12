import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		cfg: ConfigService,
		@InjectRepository(UserEntity)
		private readonly usersRepo: Repository<UserEntity>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'),
		});
	}

	async validate(payload: { sub: string }) {
		const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
		if (!user) throw new UnauthorizedException();
		return { id: user.id, email: user.email, role: user.role };
		// este objeto queda disponible como req.user en los guards y controllers
	}
}
