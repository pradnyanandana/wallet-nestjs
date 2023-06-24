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
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/auth.jwt-guard';
import { WalletDto } from './wallet.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully retrieved wallet balance' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get('/balance')
  @UseGuards(JwtAuthGuard)
  async getWalletBalance(@Request() req: any, @Res() res: Response) {
    try {
      const amount = await this.walletService.getWalletBalance(req.user.id);

      res.status(HttpStatus.OK).json({
        message: 'Success get balance',
        data: amount,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Top up wallet' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully topped up wallet' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('/top-up')
  @UseGuards(JwtAuthGuard)
  async topUpWallet(
    @Body(new ValidationPipe()) walletDto: WalletDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    try {
      const amount = await this.walletService.topUpWallet(
        req.user.id,
        walletDto.amount,
      );

      res.status(HttpStatus.OK).json({
        message: 'Success top up wallet',
        data: amount,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Pay with wallet' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully made payment with wallet' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('/pay')
  @UseGuards(JwtAuthGuard)
  async payWithWallet(
    @Body(new ValidationPipe()) walletDto: WalletDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    try {
      const amount = await this.walletService.payWithWallet(
        req.user.id,
        walletDto.amount,
      );

      res.status(HttpStatus.OK).json({
        message: 'Success pay by wallet',
        data: amount,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
