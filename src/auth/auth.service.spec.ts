import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { User } from '../user/user.entity';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let authRepository: Repository<Auth>;
  let userRepository: Repository<User>;
  let response: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(Auth),
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'password',
      };
      const user = new User();
      user.id = 1;
      const expectedToken = 'fake_token';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: expectedToken });

      await controller.login(loginDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Success login',
        data: { access_token: expectedToken },
      });
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: [
      //     { email: loginDto.emailOrUsername },
      //     { username: loginDto.emailOrUsername },
      //   ],
      // });
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.emailOrUsername,
        loginDto.password,
      );
    });

    it('should return an error message when login fails', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'password',
      };
      const user = new User();
      user.id = 1;
      const errorMessage = 'Invalid email/username or password';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new Error(errorMessage));

      await controller.login(loginDto, response);

      expect(response.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(response.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      // expect(userRepository.findOne).toHaveBeenCalledWith({
      //   where: [
      //     { email: loginDto.emailOrUsername },
      //     { username: loginDto.emailOrUsername },
      //   ],
      // });
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.emailOrUsername,
        loginDto.password,
      );
    });
  });
});
