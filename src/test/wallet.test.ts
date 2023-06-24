import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WalletService } from '../api/wallet/wallet.service';
import { UserService } from '../api/user/user.service';
import { Repository } from 'typeorm';
import { Wallet } from '../api/wallet/wallet.entity';
import { User } from '../api/user/user.entity';
import { Province } from 'src/api/user/user.dto';

describe('WalletService', () => {
  let walletService: WalletService;
  let userService: UserService;
  let walletRepository: Repository<Wallet>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        UserService,
        {
          provide: getRepositoryToken(Wallet),
          useClass: Repository,
        },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    userService = module.get<UserService>(UserService);
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
  });

  describe('getWalletBalance', () => {
    it('should return the wallet balance for a user', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Street',
        city: 'City',
        province: Province.Bali,
        telephoneNumber: '1234567890',
        email: 'test@example.com',
        username: 'johndoe',
        password: 'pass123',
        registrationDate: new Date('1990-01-01'),
        token: 'token123',
      };

      const wallet: Wallet = {
        id: 1,
        user: user,
        balance: 100,
        address: 'wallet_address',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);

      const balance = await walletService.getWalletBalance(userId);

      expect(balance).toBe(wallet.balance);
      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { user },
      });
    });
  });

  describe('topUpWallet', () => {
    it('should top up the wallet balance for a user', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Street',
        city: 'City',
        province: Province.Bali,
        telephoneNumber: '1234567890',
        email: 'test@example.com',
        username: 'johndoe',
        password: 'pass123',
        registrationDate: new Date('1990-01-01'),
        token: 'token123',
      };

      const wallet: Wallet = {
        id: 1,
        user: user,
        balance: 100,
        address: 'wallet_address',
      };
      const amount = 50;
      const updatedBalance = wallet.balance + amount;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);
      jest.spyOn(walletRepository, 'update').mockResolvedValue({} as any);

      const balance = await walletService.topUpWallet(userId, amount);

      expect(balance).toBe(updatedBalance);
      expect(wallet.balance).toBe(updatedBalance);
      expect(walletRepository.update).toHaveBeenCalledWith(wallet.id, wallet);
    });
  });

  describe('payWithWallet', () => {
    it('should pay with the wallet balance for a user', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Street',
        city: 'City',
        province: Province.Bali,
        telephoneNumber: '1234567890',
        email: 'test@example.com',
        username: 'johndoe',
        password: 'pass123',
        registrationDate: new Date('1990-01-01'),
        token: 'token123',
      };

      const wallet: Wallet = {
        id: 1,
        user: user,
        balance: 100,
        address: 'wallet_address',
      };
      const amount = 50;
      const updatedBalance = wallet.balance - amount;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);
      jest.spyOn(walletRepository, 'update').mockResolvedValue({} as any);

      const balance = await walletService.payWithWallet(userId, amount);

      expect(balance).toBe(updatedBalance);
      expect(wallet.balance).toBe(updatedBalance);
      expect(walletRepository.update).toHaveBeenCalledWith(wallet.id, wallet);
    });

    it('should throw an error if the wallet balance is insufficient', async () => {
      const userId = 1;

      const user: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Street',
        city: 'City',
        province: Province.Bali,
        telephoneNumber: '1234567890',
        email: 'test@example.com',
        username: 'johndoe',
        password: 'pass123',
        registrationDate: new Date('1990-01-01'),
        token: 'token123',
      };

      const wallet: Wallet = {
        id: 1,
        user: user,
        balance: 30,
        address: 'wallet_address',
      };
      const amount = 50;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);

      await expect(walletService.payWithWallet(userId, amount)).rejects.toThrow(
        'Insufficient balance',
      );
      expect(wallet.balance).toBe(wallet.balance);
      expect(walletRepository.update).not.toHaveBeenCalled();
    });
  });
});
