import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post("create")
    async createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user);
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
}