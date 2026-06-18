import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';
import { CategoryEntity } from './categories/category.entity';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailsModule } from './mails/mail.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.local', '.env.example'],
		}),
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'products.db',
			entities: [ProductEntity, CategoryEntity, UserEntity],
			synchronize: true,
		}),
		ProductsModule,
		CategoriesModule,
		UsersModule,
		AuthModule,
		MailsModule,
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
	}
}
