import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
  HttpStatus,
  Res,
  UseFilters,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../../middleware/jwt-guard';
import { WalletDto } from './wallet.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../middleware/http-exception.filter';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully retrieved wallet balance' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorize' })
  @Get('/balance')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  async getWalletBalance(@Request() req: any, @Res() res: Response) {
    const amount = await this.walletService.getWalletBalance(req.user.id);

    res.status(HttpStatus.OK).json({
      message: 'Success get balance',
      data: amount,
    });
  }

  @ApiOperation({ summary: 'Top up wallet' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully topped up wallet' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorize' })
  @Post('/top-up')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  async topUpWallet(
    @Body(new ValidationPipe()) walletDto: WalletDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const amount = await this.walletService.topUpWallet(
      req.user.id,
      walletDto.amount,
    );

    res.status(HttpStatus.OK).json({
      message: 'Success top up wallet',
      data: amount,
    });
  }

  @ApiOperation({ summary: 'Pay with wallet' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully made payment with wallet' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorize' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('/pay')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  async payWithWallet(
    @Body(new ValidationPipe()) walletDto: WalletDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const amount = await this.walletService.payWithWallet(
      req.user.id,
      walletDto.amount,
    );

    res.status(HttpStatus.OK).json({
      message: 'Success pay by wallet',
      data: amount,
    });
  }
}
