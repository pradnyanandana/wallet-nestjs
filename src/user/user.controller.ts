import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  Res,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../middleware/http-exception.filter';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({ description: 'Successfully created user' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.createUser(createUserDto);
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      streetAddress: user.streetAddress,
      city: user.city,
      province: user.province,
      telephoneNumber: user.telephoneNumber,
      email: user.email,
      username: user.username,
      registrationDate: user.registrationDate.toISOString(),
    };

    res.status(HttpStatus.OK).json({
      message: 'Success create user',
      data,
    });
  }
}
