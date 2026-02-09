import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
        await this.$connect()
        console.log('Prisma connected to database')
    } catch (error) {
        console.log('Prisma failed to connect to database', error)
    }
  }

  async onModuleDestroy() {
    try {
        await this.$disconnect()
        console.log('Prisma disconnected from database')
    } catch (error) {
        console.log('Prisma failed to disconnect from database', error)
    }
  }
}
