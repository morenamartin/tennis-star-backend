import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto, CreateProductFormDto } from "./dto/create-product-dto";
import { PreviewVariantsDto } from "./dto/preview-variants-dto";
import { UpdateProductDto } from "./dto/update-product-dto";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("products")
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) { }

    @Get()
    async getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(":id")
    async getProductById(@Param("id") id: string) {
        return this.productsService.getProductById(id);
    }

    @Post("preview-variants")
    async previewVariants(@Body() product: PreviewVariantsDto) {
        return this.productsService.previewVariants(product.options)
    }

    @Post("create")
    @UseInterceptors(FilesInterceptor('images'))
    async createProduct(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: CreateProductFormDto,
    ) {
        return this.productsService.createProduct(
            {
                ...body,
                options: JSON.parse(body.options),
                variants: JSON.parse(body.variants),
            },
            files,
        );
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: string) {
        return this.productsService.deleteProduct(id);
    }

    @Patch(":id")
    async updateProduct(@Param("id") id: string, @Body() product: UpdateProductDto) {
        return this.productsService.updateProduct(id, product);
    }
}   
