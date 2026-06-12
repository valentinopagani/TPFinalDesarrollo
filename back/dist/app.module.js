"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const products_module_1 = require("./products/products.module");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./products/product.entity");
const category_entity_1 = require("./categories/category.entity");
const categories_module_1 = require("./categories/categories.module");
const users_module_1 = require("./users/users.module");
const logger_middleware_1 = require("./common/middlewares/logger.middleware");
const timing_middleware_1 = require("./common/middlewares/timing.middleware");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./users/user.entity");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware, timing_middleware_1.TimingMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local', '.env.example'],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'products.db',
                entities: [product_entity_1.ProductEntity, category_entity_1.CategoryEntity, user_entity_1.UserEntity],
                synchronize: true,
            }),
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map