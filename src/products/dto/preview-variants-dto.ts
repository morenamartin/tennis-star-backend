import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class PreviewVariantsDto {
    @IsArray()
    options!: { name: string; values: string[] }[];

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    stock?: number;
}