import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';
import { Response } from 'express';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

describe('WalletController', () => {
  let controller: WalletController;
  let walletService: WalletService;
  let walletRepository: Repository<Wallet>;
  let userRepository: Repository<User>;
  let response: Response;

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

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    controller = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
  });

  describe('getWalletBalance', () => {
    it('should return the wallet balance', async () => {
      const user = new User();
      user.id = 1;

      const wallet = new Wallet();
      wallet.balance = 100;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);

      await controller.getWalletBalance({ user: { id: user.id } }, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Success get balance',
        data: wallet.balance,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });

      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { user },
      });
    });

    it('should throw error when wallet not found', async () => {
      const user = new User();
      user.id = 1;

      const wallet = new Wallet();
      wallet.balance = 100;

      const errorMessage = 'Wallet not found';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await controller.getWalletBalance({ user: { id: user.id } }, response);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(errorMessage);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: user.id },
        });

        expect(walletRepository.findOne).toHaveBeenCalledWith({
          where: { user },
        });
      }
    });
  });

  describe('topUpWallet', () => {
    it('should top up the wallet and return the updated balance', async () => {
      const user = new User();
      user.id = 1;

      const amount = 50;
      const balance = 100;

      const wallet = new Wallet();
      wallet.balance = balance;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);
      jest.spyOn(walletRepository, 'update').mockResolvedValueOnce(undefined);

      await controller.topUpWallet(
        { amount },
        { user: { id: user.id } },
        response,
      );

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Success top up wallet',
        data: balance + amount,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });

      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { user },
      });
    });

    it('should throw error when wallet not found', async () => {
      const user = new User();
      user.id = 1;

      const amount = 50;
      const balance = 100;

      const wallet = new Wallet();
      wallet.balance = balance;

      const errorMessage = 'Wallet not found';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await controller.topUpWallet(
          { amount },
          { user: { id: user.id } },
          response,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(errorMessage);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: user.id },
        });

        expect(walletRepository.findOne).toHaveBeenCalledWith({
          where: { user },
        });
      }
    });
  });

  describe('payWithWallet', () => {
    it('should deduct the amount from the wallet balance and return the updated balance', async () => {
      const user = new User();
      user.id = 1;

      const amount = 20;
      const balance = 100;

      const wallet = new Wallet();
      wallet.balance = balance;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);
      jest.spyOn(walletRepository, 'update').mockResolvedValueOnce(undefined);

      await controller.payWithWallet(
        { amount },
        { user: { id: user.id } },
        response,
      );

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Success pay by wallet',
        data: balance - amount,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });

      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { user },
      });
    });

    it('should throw error when wallet not found', async () => {
      const user = new User();
      user.id = 1;

      const amount = 20;
      const balance = 100;

      const wallet = new Wallet();
      wallet.balance = balance;

      const errorMessage = 'Wallet not found';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await controller.payWithWallet(
          { amount },
          { user: { id: user.id } },
          response,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(errorMessage);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: user.id },
        });

        expect(walletRepository.findOne).toHaveBeenCalledWith({
          where: { user },
        });
      }
    });

    it('should throw an error if the wallet balance is insufficient', async () => {
      const user = new User();
      user.id = 1;

      const amount = 200;
      const balance = 100;

      const wallet = new Wallet();
      wallet.balance = balance;

      const errorMessage = 'Insufficient balance';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(wallet);

      try {
        await controller.payWithWallet(
          { amount },
          { user: { id: user.id } },
          response,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(errorMessage);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: user.id },
        });

        expect(walletRepository.findOne).toHaveBeenCalledWith({
          where: { user },
        });
      }
    });
  });
});
