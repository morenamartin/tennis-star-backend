import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async login(user: LoginUserDto) {
        const dbUser = await this.prisma.user.findUnique({ where: { email: user.email } });
        if (!dbUser) {
            throw new BadRequestException('Usuario o contraseña incorrectas');
        }
        const isPasswordValid = await bcrypt.compare(user.password, dbUser.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Usuario o contraseña incorrectas');
        }

        const userPayload: any = {
            sub: dbUser.id,
            id: dbUser.id,
            email: dbUser.email
        };

        const token = this.jwtService.sign(userPayload, {
            expiresIn: user.rememberMe ? '30d' : '2h'
        });

        const result: any = {
            success: "User logged in successfully",
            token,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email
            }
        };

        return result;
    }

}
