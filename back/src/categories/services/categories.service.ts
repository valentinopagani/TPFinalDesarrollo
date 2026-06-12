import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CATEGORIES_REPOSITORY } from '../repositories/typeormCategoriesRepository';
import { CategoriesRepository } from '../repositories/categories.respository';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';

@Injectable()
export class CategoriesService {
	constructor(
		@Inject(CATEGORIES_REPOSITORY)
		private readonly categoriesRepository: CategoriesRepository,
	) {}

	async findAll(name?: string): Promise<Category[]> {
		const categories = await this.categoriesRepository.findAll();
		if (!name) return categories;
		return categories.filter(
			(category) => category.name.toUpperCase() === name.toUpperCase(),
		);
	}

	async findOne(id: number): Promise<Category> {
		const category = await this.categoriesRepository.findById(id);
		if (!category) throw new NotFoundException('Categiry not found');
		return category;
	}

	async create(input: CreateCategoryInput): Promise<Category> {
		return this.categoriesRepository.create(input);
	}

  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoriesRepository.update(id, input)
    if (!category) throw new NotFoundException('Category not found')
    return category
  }
}
