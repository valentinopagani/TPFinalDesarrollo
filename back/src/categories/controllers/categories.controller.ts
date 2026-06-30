import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import {
	Category,
	CreateCategoryInput,
	UpdateCategoryInput,
} from '../category.types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	findAll(@Query('name') name?: string): Promise<Category[]> {
		return this.categoriesService.findAll(name);
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<Category> {
		return this.categoriesService.findOne(Number(id));
	}

	@Post()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	create(@Body() body: CreateCategoryInput): Promise<Category> {
		return this.categoriesService.create(body);
	}

	@Put(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	update(
		@Param('id') id: string,
		@Body() body: UpdateCategoryInput,
	): Promise<Category> {
		return this.categoriesService.update(Number(id), body);
	}

	@Delete(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	remove(@Param('id') id: string): Promise<Category> {
		return this.categoriesService.remove(Number(id));
	}
}
