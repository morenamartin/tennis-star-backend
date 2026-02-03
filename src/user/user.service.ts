import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createUser(user: CreateUserDto) {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(user.password, 10);

        return this.prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });
    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                // Exclude password from the response
            },
        });
    }
}
