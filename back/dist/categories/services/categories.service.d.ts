import { CategoriesRepository } from '../repositories/categories.respository';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
export declare class CategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: CategoriesRepository);
    findAll(name?: string): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: UpdateCategoryInput): Promise<Category>;
}
