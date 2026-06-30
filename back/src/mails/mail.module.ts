import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import mailConfig from '../config/mail.config'

@Module({
	imports: [
		ConfigModule.forFeature(mailConfig),
		MailerModule.forRootAsync(mailConfig.asProvider()),
	],
	exports: [MailerModule],
})
export class MailsModule {}
