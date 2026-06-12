import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
import { ProductsRepository } from '../repositories/products.repository';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: ProductsRepository);
    findAll(name?: string, sortBy?: 'id' | 'name' | 'price' | 'stock', order?: 'ASC' | 'DESC', page?: number, limit?: number): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Product>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product>;
    updateStock(id: number, quantity: number): Promise<Product>;
    remove(id: number): Promise<Product>;
}
