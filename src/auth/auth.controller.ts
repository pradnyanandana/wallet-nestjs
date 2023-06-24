import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({ description: 'Successfully logged in' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res() res: Response,
  ) {
    try {
      const { emailOrUsername, password } = loginDto;
      const token = await this.authService.login(emailOrUsername, password);

      res.status(HttpStatus.OK).json({
        message: 'Success login',
        data: token,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
