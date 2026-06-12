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
exports.TypeOrmProductsRepository = exports.PRODUCTS_REPOSITORY = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../product.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
exports.PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';
let TypeOrmProductsRepository = class TypeOrmProductsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find({ relations: ['category'] });
    }
    async findById(id) {
        const entity = await this.repo.findOne({ where: { id }, relations: ['category'] });
        return entity ?? undefined;
    }
    async create(input) {
        const entity = this.repo.create(input);
        return this.repo.save(entity);
    }
    async update(id, input) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            return undefined;
        if (input.name !== undefined)
            entity.name = input.name;
        if (input.price !== undefined)
            entity.price = input.price;
        if (input.stock !== undefined)
            entity.stock = input.stock;
        if (input.categoryId !== undefined)
            entity.categoryId = input.categoryId;
        return this.repo.save(entity);
    }
    async remove(id) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            return undefined;
        await this.repo.remove(entity);
        return { ...entity, id };
    }
};
exports.TypeOrmProductsRepository = TypeOrmProductsRepository;
exports.TypeOrmProductsRepository = TypeOrmProductsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductsRepository);
//# sourceMappingURL=typeormProductsRepository.js.map