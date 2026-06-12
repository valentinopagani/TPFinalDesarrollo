import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { Category, CreateCategoryInput } from "../category.types";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Query('name') name: string,
  ): Promise<Category[]> {
    return this.categoriesService.findAll(name)
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id)
  }

  @Post()
  create(@Body() Body: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(Body)
  }
}