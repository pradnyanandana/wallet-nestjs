import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
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
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
