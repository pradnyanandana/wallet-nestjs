import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/auth.jwt-guard';
import { WalletDto } from './wallet.dto';

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
  async topUpWallet(
    @Body(new ValidationPipe()) walletDto: WalletDto,
    @Request() req: any,
  ) {
    return this.walletService.topUpWallet(req.user.id, walletDto.amount);
  }

  @Post('/pay')
  @UseGuards(JwtAuthGuard)
  async payWithWallet(
    @Body(new ValidationPipe()) walletDto: WalletDto,
    @Request() req: any,
  ) {
    try {
      return this.walletService.payWithWallet(req.user.id, walletDto.amount);
    } catch (error) {
      return { error: error.message };
    }
  }
}
