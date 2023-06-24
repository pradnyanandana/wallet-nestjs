import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from 'src/api/user/user.entity';
import { createHash } from 'crypto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly userService: UserService,
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWallet(user: User): Promise<Wallet> {
    const data = `${user.username}:${user.email}`;
    const address = createHash('sha256').update(data).digest('hex');

    const wallet = new Wallet();

    wallet.user = user;
    wallet.balance = 0;
    wallet.address = address;

    try {
      return await this.walletRepository.save(wallet);
    } catch (error) {
      throw new Error('Failed to save wallet to the database');
    }
  }

  async getWalletBalance(userId: number): Promise<number> {
    const user = await this.userService.findById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user },
    });

    return wallet.balance;
  }

  async topUpWallet(userId: number, amount: number): Promise<number> {
    const user = await this.userService.findById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user },
    });

    wallet.balance += amount;

    await this.walletRepository.update(wallet.id, wallet);

    return wallet.balance;
  }

  async payWithWallet(userId: number, amount: number): Promise<number> {
    const user = await this.userService.findById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user },
    });

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    wallet.balance -= amount;

    await this.walletRepository.update(wallet.id, wallet);

    return wallet.balance;
  }
}
