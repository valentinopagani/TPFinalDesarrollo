export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
};
export declare class CreateProductInput {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
}
export declare class UpdateProductInput {
    name?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
}
