import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateVariantDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
}
