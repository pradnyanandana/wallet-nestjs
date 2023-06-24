import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/auth.jwt-guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/balance')
  @UseGuards(JwtAuthGuard)
  async getWalletBalance(@Request() req: any) {
    return this.walletService.getWalletBalance(req.user.id);
  }

  @Post('/top-up')
  @UseGuards(JwtAuthGuard)
  async topUpWallet(@Body('amount') amount: number, @Request() req: any) {
    return this.walletService.topUpWallet(req.user.id, amount);
  }

  @Post('/pay')
  @UseGuards(JwtAuthGuard)
  async payWithWallet(@Body('amount') amount: number, @Request() req: any) {
    return this.walletService.payWithWallet(req.user.id, amount);
  }
}
