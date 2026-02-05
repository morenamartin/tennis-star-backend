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
            select: {
                id: true,
                name: true,
                position: true,
                parent: true,
                subCategories: true,
            },
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
            throw new ConflictException(`La posición ${position} ya está ocupada`);
        }

        return this.prisma.category.update({
            where: { id: categoryId },
            data: { position },
        });
    }

    async updateCategory(categoryId: string, data: { name?: string; position?: number; parentId?: string | null }) {
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.position !== undefined) updateData.position = data.position;
        
        if (data.parentId !== undefined) {
            if (data.parentId === null || data.parentId === 'root') {
                updateData.parent = { disconnect: true };
            } else {
                updateData.parent = { connect: { id: data.parentId } };
            }
        }

        try {
            return await this.prisma.category.update({
                where: { id: categoryId },
                data: updateData,
                include: {
                    parent: true,
                    subCategories: true,
                },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Categoría con ID "${categoryId}" no encontrada`);
            }
            throw error;
        }
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
