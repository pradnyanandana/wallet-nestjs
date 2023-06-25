import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { EthService } from './eth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EthDto } from './eth.dto';

@ApiTags('eth')
@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @ApiOperation({ summary: 'Get encryption' })
  @ApiOkResponse({ description: 'Successfully encrypt message' })
  @Post('/encrypt')
  async encrypt(
    @Body(new ValidationPipe()) ethDto: EthDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const data = await this.ethService.encrypt(
      ethDto.publicKey,
      ethDto.message,
    );

    res.status(HttpStatus.OK).json({
      message: 'Success encrypt message',
      data: data,
    });
  }
}
