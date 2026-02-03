import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { CreateSalesDto } from "./dto/create-sales-dto";
import { SaleStatus } from "generated/prisma/enums";
import { UpdateStatusDto } from "./dto/update-status-dto";

@Controller('sales')
export class SalesController {
    constructor(
        private readonly salesService: SalesService
    ) { }

    @Post()
    async create(@Body() data: CreateSalesDto) {
        return this.salesService.create(data);
    }

    @Get()
    async findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }

    @Patch()
    async updateStatus(@Body() data: UpdateStatusDto) {
        return this.salesService.updateStatus(data);
    }
}