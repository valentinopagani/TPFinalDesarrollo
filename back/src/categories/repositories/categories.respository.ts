import {
	Category,
	CreateCategoryInput,
	UpdateCategoryInput,
} from '../category.types';

export interface CategoriesRepository {
	findAll(): Category[] | Promise<Category[]>;

	findById(id: number): Category | undefined | Promise<Category | undefined>;

	create(input: CreateCategoryInput): Category | Promise<Category>;

	update(
		id: number,
		input: UpdateCategoryInput,
	): Category | undefined | Promise<Category | undefined>;
}
