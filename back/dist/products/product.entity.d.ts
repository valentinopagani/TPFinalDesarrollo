import { CategoryEntity } from "../categories/category.entity";
export declare class ProductEntity {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: CategoryEntity;
    categoryId: number;
}
