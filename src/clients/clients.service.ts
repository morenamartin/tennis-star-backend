import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}        
  
  async getClients() {
    return this.prisma.client.findMany({
      select: {
          id: true,
          name: true,
          email: true,
          phone: true,
           sales: true,
      },
    }); 
  }

}
