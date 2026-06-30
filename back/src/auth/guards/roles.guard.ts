import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(
			ROLES_KEY,
			[ctx.getHandler(), ctx.getClass()],
		);
		if (!required?.length) return true;

		const req = ctx.switchToHttp().getRequest();
		const role = req.user?.role as UserRole | undefined;
		return !!role && required.includes(role);
	}
}
