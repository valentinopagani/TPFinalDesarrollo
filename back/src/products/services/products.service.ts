import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';

import {
	CreateProductInput,
	Product,
	UpdateProductInput,
} from '../product.types';

import { ProductsRepository } from '../repositories/products.repository';
import { PRODUCTS_REPOSITORY } from '../repositories/typeormProductsRepository';

@Injectable()
export class ProductsService {
	constructor(
		@Inject(PRODUCTS_REPOSITORY)
		private readonly productsRepository: ProductsRepository,
	) {}

	async findAll(
		name?: string,
		sortBy: 'id' | 'name' | 'price' | 'stock' = 'id',
		order: 'ASC' | 'DESC' = 'ASC',
		page: number = 1,
		limit: number = 10,
	): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
		let products = await this.productsRepository.findAll();
		
		// Filtrar por nombre
		if (name) {
			products = products.filter(
				(product) => product.name.toUpperCase().includes(name.toUpperCase()),
			);
		}

		// Ordenar
		products.sort((a, b) => {
			const aVal = a[sortBy];
			const bVal = b[sortBy];
			const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
			return order === 'ASC' ? comparison : -comparison;
		});

		const total = products.length;
		const startIdx = (page - 1) * limit;
		const items = products.slice(startIdx, startIdx + limit);

		return { items, total, page, limit };
	}

	async findOne(id: number): Promise<Product> {
		const product = await this.productsRepository.findById(id);
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	async create(input: CreateProductInput): Promise<Product> {
		return this.productsRepository.create(input);
	}

	async update(id: number, input: UpdateProductInput): Promise<Product> {
		const product = await this.productsRepository.update(id, input);
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	async updateStock(id: number, quantity: number): Promise<Product> {
		const product = await this.productsRepository.findById(id);
		if (!product) throw new NotFoundException('Product not found');
		if (quantity > product.stock)
			throw new BadRequestException('Stock insuficiente');

		const updatedProduct = await this.productsRepository.update(id, {
			stock: product.stock - quantity,
		});
		if (!updatedProduct) throw new NotFoundException('Product not found');
		return updatedProduct;
	}

	async remove(id: number): Promise<Product> {
		const product = await this.productsRepository.remove(id);
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}
}
