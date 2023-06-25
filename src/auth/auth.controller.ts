import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../middleware/http-exception.filter';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({ description: 'Invalid username/password' })
  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res() res: Response,
  ) {
    const { emailOrUsername, password } = loginDto;
    const token = await this.authService.login(emailOrUsername, password);

    res.status(HttpStatus.OK).json({
      message: 'Success login',
      data: token,
    });
  }
}
