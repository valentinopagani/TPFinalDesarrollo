import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import {
	ForgotPasswordInput,
	LoginInput,
	RegisterInput,
	ResetPasswordInput,
	VerifyEmailInput,
	toSafeUser,
} from 'src/users/user.types';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() body: RegisterInput) {
		return this.authService.register(body.email, body.password);
	}

	@Post('verify-email')
	@HttpCode(200)
	verifyEmail(@Body() body: VerifyEmailInput) {
		return this.authService.verifyEmail(body.token);
	}

	@Post('resend-verification')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async resendVerification(@Req() req: any, @Body() body: { email?: string }) {
		const email = body?.email ?? req.user.email;
		return this.authService.resendVerificationEmail(email);
	}

	@Post('forgot-password')
	forgotPassword(@Body() body: ForgotPasswordInput) {
		return this.authService.forgotPassword(body.email);
	}

	@Post('reset-password')
	resetPassword(@Body() body: ResetPasswordInput) {
		return this.authService.resetPassword(body.token, body.newPassword);
	}

	@Post('login')
	login(@Body() body: LoginInput) {
		return this.authService.login(body.email, body.password);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async findMe(@Req() req: any) {
		const userId = req.user.id;
		const user = await this.authService.findOneById(userId);
		// /auth/me incluye isVerified (requerido por la sección 1.1)
		return { ...toSafeUser(user), isVerified: user.isVerified };
	}

	// @Get()
	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @Roles(UserRole.ADMIN)
	// findAll() {
	// 	return this.usersService.findAll();
	// }

	// @Get(':id')
	// @UseGuards(JwtAuthGuard)
	// findOne(@Param('id') id: string) {
	// 	return this.usersService.findOneById(id);
	// }
}
