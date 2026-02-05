import { Module } from "@nestjs/common";
import { DashboardHomeController } from "./dashboard-home.controller";
import { DashboardHomeService } from "./dashboard-home.service";
import { ProductsModule } from "src/products/products.module";
import { SalesModule } from "src/sales/sales.module";

@Module({
    imports: [ProductsModule, SalesModule],
    controllers: [DashboardHomeController],
    providers: [DashboardHomeService],
})
export class DashboardHomeModule { }
