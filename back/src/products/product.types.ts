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
import { Category } from '../categories/category.types';

export type Product = {
	id: number;
	name: string;
	price: number;
	stock: number;
	categoryId: number | null;
	category?: Category | null;
};

export class CreateProductInput {
	@IsString()
	@MinLength(1)
	@MaxLength(256)
	name!: string;

	@IsNumber({ maxDecimalPlaces: 4 })
	@IsPositive()
	price!: number;

	@IsInt()
	@Min(0)
	@IsOptional()
	stock?: number;

	@IsInt()
	@IsOptional()
	categoryId?: number;
}

export class UpdateProductInput {
	@IsString()
	@MinLength(1)
	@MaxLength(256)
	@IsOptional()
	name?: string;

	@IsNumber({ maxDecimalPlaces: 4 })
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
