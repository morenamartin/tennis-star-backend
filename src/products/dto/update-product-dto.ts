import { ProductStatus } from "./create-product-dto";

export class UpdateProductDto {
    name?: string;
    description?: string;
    brand?: string;
    brandId?: string;
    stock?: number;
    status?: ProductStatus;
    categoryId?: string;
    images?: string | string[];
    options?: {
        name: string;
        values: string[];
    }[];
    variants?: {
        sku: string;
        price: number;
        stock: number;
        attributes: Record<string, any>;
    }[];
}
