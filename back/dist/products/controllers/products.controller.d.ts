import { ProductsService } from '../services/products.service';
import { CreateProductInput, Product, UpdateProductInput } from '../product.types';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(name?: string, sortBy?: 'id' | 'name' | 'price' | 'stock', order?: 'ASC' | 'DESC', page?: string, limit?: string): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Product>;
    create(body: CreateProductInput): Promise<Product>;
    updateStock(id: string, quantity: number): Promise<Product>;
    update(id: string, body: UpdateProductInput): Promise<Product>;
    remove(id: string): Promise<Product>;
}
