import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getWalletBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const wallet = await this.walletRepository.findOne({
      where: { user },
    });

    return wallet.balance;
  }

  async topUpWallet(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const wallet = await this.walletRepository.findOne({
      where: { user },
    });

    wallet.balance += amount;

    await this.walletRepository.update(wallet.id, wallet);

    return wallet.balance;
  }

  async payWithWallet(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const wallet = await this.walletRepository.findOne({
      where: { user },
    });

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance -= amount;

    await this.walletRepository.update(wallet.id, wallet);

    return wallet.balance;
  }
}
