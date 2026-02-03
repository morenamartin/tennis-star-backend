import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductGender } from 'generated/prisma/enums';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createProduct(product: CreateProductDto) {
        // Check if product name exists
        const existingName = await this.prisma.product.findFirst({
            where: { name: product.name },
        });

        if (existingName) {
            throw new ConflictException(`Product with name "${product.name}" already exists`);
        }

        const { categoryId, options, variants, images, ...rest } = product;

        // Ensure images is always an array
        const imageList = Array.isArray(images) ? images : [images];

        try {
            return await this.prisma.product.create({
                data: {
                    ...rest,
                    images: imageList,
                    gender: rest.gender as ProductGender,
                    category: {
                        connect: { id: categoryId },
                    },
                    options: {
                        create: options.map(opt => ({
                            name: opt.name,
                            values: opt.values
                        })),
                    },
                    variants: {
                        create: variants.map(variant => ({
                            sku: variant.sku,
                            price: variant.price,
                            stock: variant.stock,
                            attributes: variant.attributes,
                        })),
                    },
                },
                include: {
                    options: true,
                    variants: true,
                }
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException(`Product with this name or SKU already exists`);
            }
            throw error;
        }
    }

    async getProductById(productId: string) {
        return this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                options: true,
                variants: true,
            }
        });
    }

    async getAllProducts() {
        return this.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                gender: true,
                brand: true,
                images: true,
                status: true,
                category: { select: { name: true } },
                options: true,
                variants: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async deleteProduct(productId: string) {
        try {
            return await this.prisma.product.delete({
                where: { id: productId },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product with ID "${productId}" not found`);
            }
            throw error;
        }
    }
}
