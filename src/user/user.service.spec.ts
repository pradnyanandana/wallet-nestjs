import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Repository, EntityManager } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto, Province } from './user.dto';
import { Wallet } from '../wallet/wallet.entity';
import * as Util from '../auth/auth.util';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;
  let response: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        EntityManager,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Wallet),
          useClass: Repository,
        },
      ],
    }).compile();

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  describe('createUser', () => {
    it('should create a new user and return the user details', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Main Street',
        city: 'City',
        province: Province.Jakarta,
        telephoneNumber: '1234567890',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password',
      };

      const user = new User();
      Object.assign(user, createUserDto);
      user.registrationDate = new Date();

      const expectedUserDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth.toISOString(),
        streetAddress: user.streetAddress,
        city: user.city,
        province: user.province,
        telephoneNumber: user.telephoneNumber,
        email: user.email,
        username: user.username,
      };

      const wallet = new Wallet();
      wallet.user = user;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(entityManager, 'transaction').mockImplementation(async () => {
        return true;
      });
      jest.spyOn(Util, 'hashPassword').mockResolvedValueOnce('hashedPassword');

      const result = await controller.createUser(createUserDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(result).toHaveProperty('registrationDate');
      expect(
        Object.fromEntries(
          Object.entries(result).filter(([key]) => key !== 'registrationDate'),
        ),
      ).toEqual(expectedUserDetails);
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { username: createUserDto.username },
      // });
      // expect(userRepository.save).toHaveBeenCalledWith(user);
      // expect(entityManager.transaction).toHaveBeenCalled();
      // expect(Util.hashPassword).toHaveBeenCalledWith(createUserDto.password);
    });

    it('should throw an exception when the username is already taken', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Main Street',
        city: 'City',
        province: Province.Jakarta,
        telephoneNumber: '1234567890',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password',
      };

      const existingUser = new User();

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);
      jest.spyOn(Util, 'hashPassword').mockResolvedValueOnce('hashedPassword');

      await expect(
        controller.createUser(createUserDto, response),
      ).rejects.toThrowError('Username is already taken');
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { username: createUserDto.username },
      // });
    });

    it('should throw an exception when the user fails to save in the database', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        streetAddress: '123 Main Street',
        city: 'City',
        province: Province.Jakarta,
        telephoneNumber: '1234567890',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce(new Error('Failed to save user'));

      await expect(
        controller.createUser(createUserDto, response),
      ).rejects.toThrowError('Failed to save user to the database');
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: { username: createUserDto.username },
      // });
      // expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });
  });
});
