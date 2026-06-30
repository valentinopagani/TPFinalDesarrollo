import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
	CreateProductInput,
	Product,
	UpdateProductInput,
} from '../product.types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findAll(
		@Query('name') name?: string,
		@Query('sortBy') sortBy: 'id' | 'name' | 'price' | 'stock' = 'id',
		@Query('order') order: 'ASC' | 'DESC' = 'ASC',
		@Query('page') page: string = '1',
		@Query('limit') limit: string = '10',
	): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
		return this.productsService.findAll(
			name,
			sortBy,
			order,
			Number(page),
			Number(limit),
		);
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<Product> {
		return this.productsService.findOne(Number(id));
	}

	@Post()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	create(@Body() body: CreateProductInput): Promise<Product> {
		return this.productsService.create(body);
	}

	@Patch(':id/stock')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	updateStock(
		@Param('id') id: string,
		@Body('quantity') quantity: number,
	): Promise<Product> {
		return this.productsService.updateStock(Number(id), quantity);
	}

	@Put(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	update(
		@Param('id') id: string,
		@Body() body: UpdateProductInput,
	): Promise<Product> {
		return this.productsService.update(Number(id), body);
	}

	@Delete(':id')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	remove(@Param('id') id: string): Promise<Product> {
		return this.productsService.remove(Number(id));
	}
}
