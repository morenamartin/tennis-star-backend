import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { SalesService } from 'src/sales/sales.service';

@Injectable()
export class DashboardHomeService {
    constructor(
        private readonly productsService: ProductsService,
        private readonly salesService: SalesService
    ) { }

    async getDataHome() {
        const products = await this.productsService.getAllProducts();
        const sales = await this.salesService.findAll();
        const productsMoreSold = await this.productsService.getMoreSoldProducts();

        const totalPriceProducts = products.reduce((acc, product) => {
            const productSum = product.variants.reduce((total, variant) => total + variant.price.toNumber(), 0);
            return acc + productSum;
        }, 0);

        const dataProducts = products.map(product => {
            return {
                id: product.id,
                name: product.name,
                stock: product.stock,
            }
        })

        const dataSales = sales.map(sale => {
            return {
                client: sale.client.name,
                orderNumber: sale.orderNumber,
                status: sale.status,
                total: sale.total,
                createdAt: sale.createdAt,
            }
        })
        const recentSales = dataSales.slice(0, 5);

        const totalProducts = dataProducts.length;


        const data = {
            products: dataProducts,
            totalPriceProducts: totalPriceProducts,
            totalProducts: totalProducts,
            recentSales: recentSales,
            productsMoreSold: productsMoreSold,
        };

        return data;
    }
}
