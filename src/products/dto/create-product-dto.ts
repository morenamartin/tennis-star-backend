export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

interface ProductOptions {
    name: string;
    values: string[];
}

interface ProductVariant {
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, any>;
}

export class CreateProductDto {
    name!: string;
    description!: string;
    stock!: number;
    gender!: string;
    brand!: string;
    images!: string | string[];
    status?: ProductStatus.ACTIVE;
    categoryId!: string;
    options!: ProductOptions[];
    variants!: ProductVariant[];
}   