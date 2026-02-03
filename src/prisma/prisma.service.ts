import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is not defined');
        }

        console.log('🔗 Connecting to database...');

        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);

        super({ adapter });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Prisma connected to database');
        } catch (error: any) {
            console.error('❌ Failed to connect to database:', error.message);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('🔌 Prisma disconnected from database');
    }
}
