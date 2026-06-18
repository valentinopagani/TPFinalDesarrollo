import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	UseGuards,
	Req,
	Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user-role.enum';

@Controller('auth')
export class AuthController {
	constructor(private readonly usersService: UsersService) {}

	@Post('register')
	register(@Body() body: { email: string; password: string }) {
		return this.usersService.register(body.email, body.password);
	}

	@Get('verify')
	verifyEmail(@Query('token') token: string) {
		return this.usersService.verifyEmail(token);
	}

	@Post('login')
	login(@Body() body: { email: string; password: string }) {
		return this.usersService.login(body.email, body.password);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async findMe(@Req() req: any) {
		const userId = req.user.id;
		const user = await this.usersService.findOneById(userId);
		const { passwordHash, ...userWithoutPassword } = user;
		return userWithoutPassword;
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

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	findOne(@Param('id') id: string) {
		return this.usersService.findOneById(id);
	}
}
