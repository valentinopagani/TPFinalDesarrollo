import { Global, Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailsModule } from 'src/mails/mail.module';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule), MailsModule],
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			provide: USERS_GATEWAY,
			useFactory: () => {
				return process.env.USERS_SOURCE === 'local'
					? new LocalUsersGateway()
					: new JsonPlaceholderUsersGateway();
			},
		},
	],
	exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}
