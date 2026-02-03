import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product-dto";

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

    @Post("create")
    async createProduct(@Body() product: CreateProductDto) {
        return this.productsService.createProduct(product);
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: string) {
        return this.productsService.deleteProduct(id);
    }
}   
