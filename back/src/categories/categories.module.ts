import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import {
	CATEGORIES_REPOSITORY,
	TypeOrmCategoriesRepository,
} from './repositories/typeormCategoriesRepository';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	controllers: [CategoriesController],
	providers: [
		CategoriesService,
		{ provide: CATEGORIES_REPOSITORY, useClass: TypeOrmCategoriesRepository },
	],
	exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
