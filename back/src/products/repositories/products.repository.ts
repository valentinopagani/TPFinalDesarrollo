import {
	CreateProductInput,
	Product,
	UpdateProductInput,
} from '../product.types';

export interface ProductsRepository {
	findAll(): Product[] | Promise<Product[]>;

	findById(id: number): Product | undefined | Promise<Product | undefined>;

	create(input: CreateProductInput): Product | Promise<Product>;

	update(
		id: number,
		input: UpdateProductInput,
	): Product | undefined | Promise<Product | undefined>;

	remove(id: number): Product | undefined | Promise<Product | undefined>;
}
