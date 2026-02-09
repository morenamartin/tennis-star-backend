import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user, rememberMe } = await this.authService.login(body);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: rememberMe
        ? 1000 * 60 * 60 * 24 * 30 // 30 días
        : 1000 * 60 * 60 * 2,     // 2 horas
    });

    res.cookie('session_id', user.id, {
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: rememberMe
        ? 1000 * 60 * 60 * 24 * 30 // 30 días
        : 1000 * 60 * 60 * 2,     // 2 horas
    });

    return {
      success: true,
      user,
    };
  }

  @Post('sign-out')
  async signOut(
    @Res({ passthrough: true }) res: Response,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('session', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    res.clearCookie('session_id', {
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    return { success: true };
  }
}
