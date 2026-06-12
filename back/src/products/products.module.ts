import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import {
	PRODUCTS_REPOSITORY,
	TypeOrmProductsRepository,
} from './repositories/typeormProductsRepository';
import { ProductsService } from './services/products.service';
import { ProductEntity } from './product.entity';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity])],
	controllers: [ProductsController],
	providers: [
		ProductsService,
		{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
	],
	exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}
