import { Controller, Get } from '@nestjs/common';
import { DashboardHomeService } from './dashboard-home.service';

@Controller("dashboard-home")
export class DashboardHomeController {
    constructor(
        private readonly dashboardHomeService: DashboardHomeService
    ) { }

    @Get()
    getDataHome() {
        return this.dashboardHomeService.getDataHome();
    }
}
