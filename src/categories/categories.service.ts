import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/categories-dto';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createCategory(category: CreateCategoryDto) {
        const { parent, ...rest } = category;

        // Check if category name exists
        const existingName = await this.prisma.category.findUnique({
            where: { name: category.name },
        });

        if (existingName) {
            throw new ConflictException(`Categoría con nombre "${category.name}" ya existe`);
        }

        // Check if position exists
        const existingPosition = await this.prisma.category.findFirst({
            where: { position: category.position },
        });

        if (existingPosition) {
            throw new ConflictException(`Categoría con posición ${category.position} ya existe`);
        }

        try {
            const newCategory = await this.prisma.category.create({
                data: {
                    ...rest,
                    parent: parent?.id ? { connect: { id: parent.id } } : undefined,
                }
            });

            return {
                message: 'Categoría creada exitosamente',
                category: newCategory
            };
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException(`Categoría ya existe`);
            }
            throw error;
        }
    }

    async getCategoryById(categoryId: string) {
        return this.prisma.category.findUnique({
            where: { id: categoryId },
        });
    }

    async getAllCategories() {
        return this.prisma.category.findMany({
            orderBy: {
                position: 'asc',
            },
            select: {
                id: true,
                name: true,
                position: true,
                parent: true,
                subCategories: true,
            },
        });
    }

    async updateCategoryPosition(categoryId: string, position: number) {
        const existingPosition = await this.prisma.category.findFirst({
            where: {
                position: position,
                NOT: { id: categoryId },
            },
        });

        if (existingPosition) {
            throw new ConflictException(`Category with position ${position} already exists`);
        }

        return this.prisma.category.update({
            where: { id: categoryId },
            data: { position },
        });
    }

    async deleteCategory(categoryId: string) {
        try {
            return await this.prisma.category.delete({
                where: { id: categoryId },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Category with ID "${categoryId}" not found`);
            }
            throw error;
        }
    }
}
