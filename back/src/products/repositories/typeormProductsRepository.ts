import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';
import { ProductEntity } from '../product.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private repo: Repository<ProductEntity>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repo.find({ relations: ['category'] });
  }

  async findById(id: number): Promise<Product | undefined> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['category'] });
    return entity ?? undefined;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    // Recargar con la relación category para incluirla en la response
    const reloaded = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });
    return reloaded as Product;
  }

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return undefined;

    if (input.name !== undefined) entity.name = input.name;
    if (input.price !== undefined) entity.price = input.price;
    if (input.stock !== undefined) entity.stock = input.stock;
    if (input.categoryId !== undefined) entity.categoryId = input.categoryId;

    await this.repo.save(entity);
    // Recargar con la relación category para incluirla en la response
    const reloaded = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    return reloaded ?? undefined;
  }

  async remove(id: number): Promise<Product | undefined> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!entity) return undefined;

    await this.repo.remove(entity);
    // Restore the id since TypeORM clears it after remove
    return { ...entity, id };
  }
}
