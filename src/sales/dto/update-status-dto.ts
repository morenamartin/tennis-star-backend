import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SaleStatus } from "generated/prisma/enums";

export class UpdateStatusDto {

    @IsString()
    @IsOptional()
    note?: string;

    @IsString()
    @IsNotEmpty()
    saleId!: string;

    @IsEnum(SaleStatus)
    @IsNotEmpty()
    status!: SaleStatus;

    @IsString()
    @IsNotEmpty()
    userId!: string;
}