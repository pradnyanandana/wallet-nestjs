import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    try {
      const { emailOrUsername, password } = loginDto;
      return await this.authService.login(emailOrUsername, password);
    } catch (error) {
      return { error: error.message };
    }
  }
}
