import { IsNotEmpty, IsOptional } from "class-validator";

interface Parent {
    id: string;
}

export class CreateCategoryDto {
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    position!: number;

    @IsOptional()
    parent?: Parent;
}