import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";


class CreateSaleItemDto {
    @IsString()
    @IsNotEmpty()
    variantId!: string;

    @IsNumber()
    @IsNotEmpty()
    quantity!: number;

    @IsNumber()
    @IsOptional()
    total?: number;
}


enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER'
}

export class CreateSalesDto {

    @IsString()
    @IsOptional()
    orderNumber?: string;

    @IsString()
    @IsNotEmpty()
    clientId!: string;

    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod!: PaymentMethod;

    @IsNumber()
    @IsOptional()
    total?: number;


    @IsString()
    @IsNotEmpty()
    shippingAddress!: string;

    @IsString()
    @IsOptional()
    trackingCode?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemDto)
    items!: CreateSaleItemDto[];
}