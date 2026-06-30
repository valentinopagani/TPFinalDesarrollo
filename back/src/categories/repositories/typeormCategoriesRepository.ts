import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../category.entity';
import { Repository } from 'typeorm';
import {
	Category,
	CreateCategoryInput,
	UpdateCategoryInput,
} from '../category.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
	constructor(
		@InjectRepository(CategoryEntity)
		private repo: Repository<CategoryEntity>,
	) {}

	findAll(): Promise<Category[]> {
		return this.repo.find({ order: { name: 'ASC' } });
	}

	async findById(id: number): Promise<Category | undefined> {
		const entity = await this.repo.findOne({ where: { id } });
		return entity ?? undefined;
	}

	async findByName(name: string): Promise<Category | undefined> {
		const entity = await this.repo
			.createQueryBuilder('c')
			.where('LOWER(c.name) = LOWER(:name)', { name: name.trim() })
			.getOne();
		return entity ?? undefined;
	}

	async create(input: CreateCategoryInput): Promise<Category> {
		const entity = this.repo.create(input);
		return this.repo.save(entity);
	}

	async update(
		id: number,
		input: UpdateCategoryInput,
	): Promise<Category | undefined> {
		const entity = await this.repo.findOne({ where: { id } });
		if (!entity) return undefined;
		if (input.name !== undefined) entity.name = input.name;
		return this.repo.save(entity);
	}

	async remove(id: number): Promise<Category | undefined> {
		const entity = await this.repo.findOne({ where: { id } });
		if (!entity) return undefined;
		await this.repo.remove(entity);
		return { ...entity, id };
	}
}
