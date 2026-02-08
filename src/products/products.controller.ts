import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto, CreateProductFormDto } from "./dto/create-product-dto";
import { PreviewVariantsDto } from "./dto/preview-variants-dto";
import { UpdateProductDto } from "./dto/update-product-dto";
import { UpdateVariantDto } from "./dto/update-variant-dto";
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

    @Get("more-sold")
    async getMoreSoldProducts() {
        return this.productsService.getMoreSoldProducts();
    }

    @Get("brands")
    async getBrands() {
        return this.productsService.getBrands();
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

    @Patch(":id/with-images")
    @UseInterceptors(FilesInterceptor('newImages'))
    async updateProductWithImages(
        @Param("id") id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: any
    ) {
        const updateData: UpdateProductDto = {
            ...(body.name && { name: body.name }),
            ...(body.description && { description: body.description }),
            ...(body.brand && { brand: body.brand }),
            ...(body.status && { status: body.status }),
            ...(body.stock && { stock: parseInt(body.stock) }),
            ...(body.existingImages && { images: JSON.parse(body.existingImages) }),
        };
        return this.productsService.updateProductWithImages(id, updateData, files);
    }

    @Patch("variants/:variantId")
    async updateVariant(
        @Param("variantId") variantId: string,
        @Body() data: UpdateVariantDto
    ) {
        return this.productsService.updateVariant(variantId, data);
    }

    @Delete("variants/:variantId")
    async deleteVariant(@Param("variantId") variantId: string) {
        return this.productsService.deleteVariant(variantId);
    }
}   
