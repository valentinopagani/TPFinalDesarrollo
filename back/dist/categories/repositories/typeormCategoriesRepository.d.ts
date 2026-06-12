import { CategoriesRepository } from './categories.respository';
import { CategoryEntity } from '../category.entity';
import { Repository } from 'typeorm';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
export declare const CATEGORIES_REPOSITORY = "CATEGORIES_REPOSITORY";
export declare class TypeOrmCategoriesRepository implements CategoriesRepository {
    private repo;
    constructor(repo: Repository<CategoryEntity>);
    findAll(): Promise<Category[]>;
    findById(id: number): Promise<Category | undefined>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: UpdateCategoryInput): Promise<Category | undefined>;
}
