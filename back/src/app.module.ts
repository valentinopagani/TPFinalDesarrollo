import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./products/product.entity";
import { CategoryEntity } from "./categories/category.entity";
import { CategoriesModule } from "./categories/categories.module";
import { UsersModule } from "./users/users.module";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { TimingMiddleware } from "./common/middlewares/timing.middleware";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserEntity } from "./users/user.entity";
import { AuthModule } from "./auth/auth.module";
import { MailsModule } from "./mails/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const dbType = cfg.get<string>("DB_TYPE", "postgres");
        if (dbType === "sqlite") {
          return {
            type: "sqlite",
            database: cfg.get<string>("DB_NAME", "products.db"),
            entities: [ProductEntity, CategoryEntity, UserEntity],
            synchronize: true,
          };
        }
        return {
          type: "postgres",
          host: cfg.get<string>("DB_HOST", "localhost"),
          port: cfg.get<number>("DB_PORT", 5432),
          username: cfg.get<string>("DB_USER", "postgres"),
          password: cfg.get<string>("DB_PASSWORD", "1234"),
          database: cfg.get<string>("DB_NAME", "tp_final"),
          entities: [ProductEntity, CategoryEntity, UserEntity],
          synchronize: true,
        };
      },
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
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes("*");
  }
}
