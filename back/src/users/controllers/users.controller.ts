import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user-role.enum';
import {
	ChangeEmailInput,
	ChangePasswordInput,
	DeleteAccountInput,
	UpdateRoleInput,
} from '../user.types';

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

	@Patch('me/password')
	@UseGuards(JwtAuthGuard)
	changePassword(@Req() req: any, @Body() body: ChangePasswordInput) {
		return this.usersService.changePassword(req.user.id, body);
	}

	@Patch('me/email')
	@UseGuards(JwtAuthGuard)
	changeEmail(@Req() req: any, @Body() body: ChangeEmailInput) {
		return this.usersService.changeEmail(req.user.id, body);
	}

	@Delete('me')
	@UseGuards(JwtAuthGuard)
	deleteMe(@Req() req: any, @Body() body: DeleteAccountInput) {
		return this.usersService.deleteAccount(req.user.id, body);
	}

	@Patch(':id/role')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	updateRole(
		@Req() req: any,
		@Param('id') id: string,
		@Body() body: UpdateRoleInput,
	) {
		return this.usersService.changeRole(req.user.id, id, body);
	}
}
