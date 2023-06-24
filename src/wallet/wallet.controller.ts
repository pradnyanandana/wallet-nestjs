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

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

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
