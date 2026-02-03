import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/categories-dto';

@Controller("categories")
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) { }

    @Post("create")
    async createCategory(@Body() category: CreateCategoryDto) {
        return this.categoriesService.createCategory(category);
    }

    @Get()
    async getAllCategories() {
        return this.categoriesService.getAllCategories();
    }

    @Get(":id")
    async getCategoryById(@Param("id") id: string) {
        return this.categoriesService.getCategoryById(id);
    }

    @Patch("update-position/:id")
    async updateCategoryPosition(
        @Param("id") id: string,
        @Query("position", ParseIntPipe) position: number
    ) {
        return this.categoriesService.updateCategoryPosition(id, position);
    }

    @Delete(":id")
    async deleteCategory(@Param("id") id: string) {
        return this.categoriesService.deleteCategory(id);
    }
}
