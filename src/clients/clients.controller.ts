import { Controller, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  
  @Get()
  async getClients() {
    return this.clientsService.getClients();
  }
}
