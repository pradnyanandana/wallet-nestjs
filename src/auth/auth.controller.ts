import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res() res: Response,
  ) {
    try {
      const { emailOrUsername, password } = loginDto;
      const token = await this.authService.login(emailOrUsername, password);

      res.status(HttpStatus.OK).json({
        message: 'Success create user',
        data: token,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
