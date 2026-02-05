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
    stock?: number;
    attributes: Record<string, any>;
}

export class CreateProductDto {
    name!: string;
    description!: string;
    stock?: number;
    brand!: string;
    status?: ProductStatus.ACTIVE;
    categoryId!: string;
    skuType!: 'UNIQUE' | 'PER_VARIANT';
    baseSku?: string;
    options!: ProductOptions[];
    variants!: ProductVariant[];
}

export class CreateProductFormDto {
    name!: string;
    description!: string;
    stock?: number;
    gender!: string;
    brand!: string;
    categoryId!: string;
    skuType!: 'UNIQUE' | 'PER_VARIANT';

    // 👇 llegan como string
    options!: string;
    variants!: string;
}