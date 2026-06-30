import { MailerOptions } from "@nestjs-modules/mailer";
import { registerAs } from "@nestjs/config";

export default registerAs('mailconfig',() => {
  const a:MailerOptions={
  
			transport: {
        tls:{
          rejectUnauthorized:false
        },
				host: process.env.MAIL_HOST || 'localhost',
				port: Number(process.env.MAIL_PORT) || 1025,
				secure: false,
				auth:
					process.env.MAIL_USER && process.env.MAIL_PASS
						? {
								user: process.env.MAIL_USER,
								pass: process.env.MAIL_PASS,
							}
						: undefined,
			},
		}
    return a
})