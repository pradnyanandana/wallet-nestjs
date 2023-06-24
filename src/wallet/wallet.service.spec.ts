import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';

describe('WalletController', () => {
  let controller: WalletController;
  let walletService: WalletService;
  let walletRepository: Repository<Wallet>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getWalletBalance', () => {
    it('should return the wallet balance', async () => {
      const userId = 1;
      const wallet = new Wallet();
      wallet.balance = 100;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);

      const result = await controller.getWalletBalance({
        user: { id: userId },
      });

      expect(result).toEqual(wallet.balance);
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { id: userId },
      // });
      // expect(walletRepository.findOne).toHaveBeenCalledWith({
      //   where: { user: expect.any(User) },
      // });
    });
  });

  describe('topUpWallet', () => {
    it('should top up the wallet and return the updated balance', async () => {
      const userId = 1;
      const amount = 50;
      const balance = 100;
      const wallet = new Wallet();
      wallet.balance = balance;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);
      jest.spyOn(walletRepository, 'update').mockResolvedValueOnce(undefined);

      const result = await controller.topUpWallet(amount, {
        user: { id: userId },
      });

      expect(result).toEqual(balance + amount);
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { id: userId },
      // });
      // expect(walletRepository.findOne).toHaveBeenCalledWith({
      //   where: { user: expect.any(User) },
      // });
      // expect(walletRepository.update).toHaveBeenCalledWith(
      //   wallet.id,
      //   expect.any(Wallet),
      // );
    });
  });

  describe('payWithWallet', () => {
    it('should deduct the amount from the wallet balance and return the updated balance', async () => {
      const userId = 1;
      const amount = 20;
      const balance = 100;
      const wallet = new Wallet();
      wallet.balance = balance;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);
      jest.spyOn(walletRepository, 'update').mockResolvedValueOnce(undefined);

      const result = await controller.payWithWallet(amount, {
        user: { id: userId },
      });

      expect(result).toEqual(balance - amount);
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { id: userId },
      // });
      // expect(walletRepository.findOne).toHaveBeenCalledWith({
      //   where: { user: expect.any(User) },
      // });
      // expect(walletRepository.update).toHaveBeenCalledWith(
      //   wallet.id,
      //   expect.any(Wallet),
      // );
    });

    it('should throw an error if the wallet balance is insufficient', async () => {
      const userId = 1;
      const amount = 200;
      const wallet = new Wallet();
      wallet.balance = 100;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);

      await expect(
        controller.payWithWallet(amount, { user: { id: userId } }),
      ).rejects.toThrowError('Insufficient balance');
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { id: userId },
      // });
      // expect(walletRepository.findOne).toHaveBeenCalledWith({
      //   where: { user: expect.any(User) },
      // });
    });
  });
});
