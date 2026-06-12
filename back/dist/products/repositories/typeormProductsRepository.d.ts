import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import { ProductsRepository } from './products.repository';
import { ProductEntity } from '../product.entity';
import { Repository } from 'typeorm';
export declare const PRODUCTS_REPOSITORY = "PRODUCTS_REPOSITORY";
export declare class TypeOrmProductsRepository implements ProductsRepository {
    private repo;
    constructor(repo: Repository<ProductEntity>);
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | undefined>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
    remove(id: number): Promise<Product | undefined>;
}
