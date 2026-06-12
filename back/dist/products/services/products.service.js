"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeormProductsRepository_1 = require("../repositories/typeormProductsRepository");
let ProductsService = class ProductsService {
    productsRepository;
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async findAll(name, sortBy = 'id', order = 'ASC', page = 1, limit = 10) {
        let products = await this.productsRepository.findAll();
        if (name) {
            products = products.filter((product) => product.name.toUpperCase().includes(name.toUpperCase()));
        }
        products.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return order === 'ASC' ? comparison : -comparison;
        });
        const total = products.length;
        const startIdx = (page - 1) * limit;
        const items = products.slice(startIdx, startIdx + limit);
        return { items, total, page, limit };
    }
    async findOne(id) {
        const product = await this.productsRepository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(input) {
        return this.productsRepository.create(input);
    }
    async update(id, input) {
        const product = await this.productsRepository.update(id, input);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async updateStock(id, quantity) {
        const product = await this.productsRepository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (quantity > product.stock)
            throw new common_1.BadRequestException('Stock insuficiente');
        const updatedProduct = await this.productsRepository.update(id, {
            stock: product.stock - quantity,
        });
        if (!updatedProduct)
            throw new common_1.NotFoundException('Product not found');
        return updatedProduct;
    }
    async remove(id) {
        const product = await this.productsRepository.remove(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(typeormProductsRepository_1.PRODUCTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map