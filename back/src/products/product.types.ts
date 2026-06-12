import {
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export type Product = {
	id: number;
	name: string;
	price: number;
	stock: number;
	categoryId: number;
};

export class CreateProductInput {
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name!: string;

	@IsNumber()
	@IsPositive()
	price!: number;

	@IsInt()
	@Min(0)
	stock!: number;

	@IsInt()
	@IsOptional()
	categoryId!: number;
}

export class UpdateProductInput {
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	@IsOptional()
	name?: string;

	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number;

	@IsInt()
	@Min(0)
	@IsOptional()
	stock?: number;

	@IsInt()
	@IsOptional()
	categoryId?: number;
}
