import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSalesDto } from "./dto/create-sales-dto";
import { SaleStatus } from "generated/prisma/enums";
import { UpdateStatusDto } from "./dto/update-status-dto";

@Injectable()
export class SalesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateSalesDto) {
        const orderNumber = this.generateOrderNumber();
        const trackingCode = this.generateTrackingCode();

        return this.prisma.sale.create({
            data: {
                ...data,
                orderNumber,
                trackingCode,
                items: {
                    create: data.items.map(item => ({
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })
    }

    private generateOrderNumber(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    private generateTrackingCode(): string {
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    }

    async findAll() {
        return this.prisma.sale.findMany({
            include: {
                client: { select: { id: true, name: true, email: true, phone: true } },
                items: {
                    select: {
                        quantity: true,
                        price: true,
                        variant: {
                            include: {
                                product: { select: { id: true, name: true, images: true } }
                            }
                        }
                    }
                }
            }
        })
    }

    async findOne(id: string) {
        return this.prisma.sale.findUnique({
            where: { id },
            include: {
                client: { select: { id: true, name: true, email: true, phone: true } },
                history: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                items: {
                    select: {
                        quantity: true,
                        price: true,
                        variant: {
                            include: {
                                product: { select: { id: true, name: true, images: true } }
                            }
                        }
                    }
                }
            }
        })
    }

    async updateStatus(data: UpdateStatusDto) {
        return this.prisma.$transaction(async (tx) => {
            // Update the sale status
            const sale = await tx.sale.update({
                where: { id: data.saleId },
                data: { status: data.status }
            });

            // Create history record
            await tx.saleHistory.create({
                data: {
                    saleId: data.saleId,
                    status: data.status,
                    userId: data.userId,
                    note: data.note
                }
            });

            return sale;
        });
    }
}