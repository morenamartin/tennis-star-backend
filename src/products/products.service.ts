import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    private generateVariantsFromOptions(
        options: { name: string; values: string[] }[],
    ) {
        return options.reduce(
            (acc, option) => {
                const result: Record<string, string>[] = [];

                for (const prev of acc) {
                    for (const value of option.values) {
                        result.push({
                            ...prev,
                            [option.name]: value,
                        });
                    }
                }

                return result;
            },
            [{}] as Record<string, string>[],
        );
    }

    private areAttributesEqual(
        a: Record<string, string>,
        b: Record<string, string>,
    ) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) return false;

        return aKeys.every(
            key => b[key] !== undefined && b[key] === a[key],
        );
    }

    
    async previewVariants(options: { name: string; values: string[] }[]) {
        return this.generateVariantsFromOptions(options)
            .map(attributes => ({ attributes }));
    }


    async getBrands() {
        return this.prisma.brand.findMany();
    }

    async createProduct(product: CreateProductDto, images: Express.Multer.File[]) {
        const existingName = await this.prisma.product.findFirst({
            where: { name: product.name },
        });

        if (existingName) {
            throw new ConflictException(
                `Product with name "${product.name}" already exists`,
            );
        }

        const { categoryId, options, variants, skuType, baseSku, ...rest } = product;

        const validAttributes = this.generateVariantsFromOptions(options);

        // Validar que cada variante tenga SKU y Precio
        const hasInvalidVariants = variants.some(v => !v.sku || v.price === undefined || v.price === null);
        if (hasInvalidVariants) {
            throw new BadRequestException('All variants must have a SKU and a price');
        }

        if (variants.length !== validAttributes.length) {
            throw new BadRequestException(
                'Variants count does not match options combinations',
            );
        }

        const isValid = variants.every(v =>
            validAttributes.some(attr =>
                this.areAttributesEqual(attr, v.attributes),
            ),
        );

        const skus = variants.map(v => v.sku);
        const uniqueSkus = new Set(skus);

        if (skuType === 'UNIQUE' && uniqueSkus.size !== 1) {
            throw new BadRequestException('All variants must share the same SKU');
        }

        if (skuType === 'PER_VARIANT' && uniqueSkus.size !== skus.length) {
            throw new BadRequestException('Each variant must have a unique SKU');
        }

        const slug = product.name
            .toLowerCase()
            .replace(/\s+/g, '-');

        const uploadedImages = images?.length
            ? await this.cloudinaryService.uploadImages(
                images,
                `tennis-star/products/${slug}`,
            )
            : [];

        const imageUrls = uploadedImages.map(img => img.secure_url);

        if (!isValid) {
            throw new BadRequestException(
                'Some variants do not match product options',
            );
        }

        try {
            const newProduct = await this.prisma.product.create({
                data: {
                    ...rest,
                    brand: {
                        connectOrCreate: {
                            where: { name: product.brand },
                            create: { name: product.brand },
                        },
                    },
                    images: imageUrls,
                    stock: Number(product.stock),
                    category: { connect: { id: categoryId } },
                    options: { create: options },
                    variants: { create: variants },
                },
                include: {
                    options: true,
                    variants: true,
                },
            });

            return {
                product: newProduct,
                message: 'Producto creado exitosamente',
                success: true
            }
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException(
                    `El producto con este nombre o SKU ya existe`,
                );
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
                brand: true,
                category: true,
            }
        });
    }

    async getAllProducts() {
        return this.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                stock: true,
                brand: true,
                images: true,
                status: true,
                category: { select: { name: true } },
                variants: true,
            },
        });
    }

    async getMoreSoldProducts() {
        const topVariants = await this.prisma.saleItem.groupBy({
            by: ['variantId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 3,
        });
        return this.prisma.productVariant.findMany({
            where: {
                id: {
                    in: topVariants.map(v => v.variantId).filter((id): id is string => id !== null),
                },
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        images: true,
                    },
                },
            },
        });
    }

    async deleteProduct(productId: string) {
        try {
            const deletedProduct = await this.prisma.product.delete({
                where: { id: productId },
            });

            return {
                product: deletedProduct,
                message: 'Producto eliminado exitosamente',
                success: true
            }
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`El producto con ID "${productId}" no fue encontrado`);
            }
            throw error;
        }
    }

    async updateProduct(productId: string, product: UpdateProductDto) {
        const { categoryId, images, options, variants, brandId, brand, ...rest } = product;

        try {
            const updatedProduct = await this.prisma.product.update({
                where: { id: productId },
                data: {
                    ...rest,
                    ...(images && {
                        images: Array.isArray(images) ? images : [images],
                    }),
                    ...(categoryId && {
                        category: { connect: { id: categoryId } },
                    }),
                    ...(options && {
                        options: {
                            deleteMany: {},
                            create: options,
                        },
                    }),
                    ...(variants && {
                        variants: {
                            deleteMany: {},
                            create: variants,
                        },
                    }),
                    ...(brandId ? {
                        brand: { connect: { id: brandId } },
                    } : brand ? {
                        brand: {
                            connectOrCreate: {
                                where: { name: brand },
                                create: { name: brand },
                            },
                        },
                    } : {}),
                },
            });

            return {
                product: updatedProduct,
                message: 'Producto actualizado exitosamente',
                success: true
            }
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`El producto con ID "${productId}" no fue encontrado`);
            }
            throw error;
        }
    }

    async updateProductWithImages(productId: string, product: UpdateProductDto, newImages?: Express.Multer.File[]) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct) {
            throw new NotFoundException(`El producto con ID "${productId}" no fue encontrado`);
        }

        let finalImages = product.images ? (Array.isArray(product.images) ? product.images : [product.images]) : [];

        if (newImages && newImages.length > 0) {
            const slug = existingProduct.name.toLowerCase().replace(/\s+/g, '-');
            const uploadedImages = await this.cloudinaryService.uploadImages(
                newImages,
                `tennis-star/products/${slug}`,
            );
            const newImageUrls = uploadedImages.map(img => img.secure_url);
            finalImages = [...finalImages, ...newImageUrls];
        }

        const { categoryId, images, options, variants, brandId, brand, ...rest } = product;

        try {
            const updatedProduct = await this.prisma.product.update({
                where: { id: productId },
                data: {
                    ...rest,
                    images: finalImages,
                    ...(categoryId && {
                        category: { connect: { id: categoryId } },
                    }),
                    ...(options && {
                        options: {
                            deleteMany: {},
                            create: options,
                        },
                    }),
                    ...(variants && {
                        variants: {
                            deleteMany: {},
                            create: variants,
                        },
                    }),
                    ...(brandId ? {
                        brand: { connect: { id: brandId } },
                    } : brand ? {
                        brand: {
                            connectOrCreate: {
                                where: { name: brand },
                                create: { name: brand },
                            },
                        },
                    } : {}),
                },
            });

            return {
                product: updatedProduct,
                message: 'Producto actualizado exitosamente',
                success: true
            }
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`El producto con ID "${productId}" no fue encontrado`);
            }
            throw error;
        }
    }

    async updateVariant(variantId: string, data: { price?: number; stock?: number }) {
        try {
            const updatedVariant = await this.prisma.productVariant.update({
                where: { id: variantId },
                data: {
                    ...(data.price !== undefined && { price: data.price }),
                    ...(data.stock !== undefined && { stock: data.stock }),
                },
            });

            return {
                variant: updatedVariant,
                message: 'Variante actualizada exitosamente',
                success: true
            }
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`La variante con ID "${variantId}" no fue encontrada`);
            }
            throw error;
        }
    }

    async deleteVariant(variantId: string) {
        try {
            const deletedVariant = await this.prisma.productVariant.delete({
                where: { id: variantId },
            });

            return {
                variant: deletedVariant,
                message: 'Variante eliminada exitosamente',
                success: true
            }
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`La variante con ID "${variantId}" no fue encontrada`);
            }
            throw error;
        }
    }

}
