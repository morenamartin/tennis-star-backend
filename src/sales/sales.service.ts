import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSalesDto } from "./dto/create-sales-dto";
import { UpdateStatusDto } from "./dto/update-status-dto";

@Injectable()
export class SalesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateSalesDto) {
        const orderNumber = this.generateOrderNumber();
        const trackingCode = this.generateTrackingCode();

        // 1. Get all variant IDs to fetch their prices
        const variantIds = data.items.map(item => item.variantId);

        // 2. Fetch variants from database
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            select: { id: true, price: true }
        });

        // 3. Create a map for quick access
        const variantPriceMap = new Map(variants.map(v => [v.id, Number(v.price)]));

        // 4. Calculate items with their totals and the grand total
        let grandTotal = 0;
        const itemsToCreate = data.items.map(item => {
            const unitPrice = variantPriceMap.get(item.variantId) || 0;
            const itemTotal = unitPrice * item.quantity;
            grandTotal += itemTotal;

            return {
                variantId: item.variantId,
                quantity: item.quantity,
                total: itemTotal
            };
        });

        // 5. Create the sale with calculated data
        const { items, total, ...saleData } = data; // Exclude original items and total if provided

        const sale = await this.prisma.sale.create({
            data: {
                ...saleData,
                orderNumber,
                trackingCode,
                total: grandTotal,
                items: {
                    create: itemsToCreate
                }
            },
            include: {
                items: true
            }
        });

        return {
            sale,
            message: 'Venta creada exitosamente',
            success: true
        }
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
        const sales = await this.prisma.sale.findMany({
            select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                paymentStatus: true,
                paymentMethod: true,
                createdAt: true,
                client: { select: { name: true, email: true } }
            }
        })

        return {
            sales,
            message: 'Ventas obtenidas exitosamente',
            success: true
        }
    }

    async findOne(id: string) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                client: { select: { id: true, name: true, email: true, phone: true } },
                history: {
                    select: {
                        id: true,
                        userId: false,
                        saleId: false,
                        status: true,
                        note: true,
                        createdAt: true,
                        user: { select: { id: true, name: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                items: {
                    select: {
                        quantity: true,
                        total: true,
                        variant: {
                            include: {
                                product: { select: { id: true, name: true, images: true } }
                            }
                        }
                    }
                }
            }
        })

        return {
            sale,
            message: 'Venta obtenida exitosamente',
            success: true
        }
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

            return {
                sale,
                message: 'Estado de la venta actualizado exitosamente',
                success: true
            }
        });
    }
}