import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Response } from 'express';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import * as Util from './auth.util';

describe('AuthController', () => {
  let controller: AuthController;
  let userRepository: Repository<User>;
  let response: Response;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
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

      const userSave = user;
      userSave.token = expectedToken;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(Util, 'comparePassword').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userSave);

      await controller.login(loginDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Success login',
        data: { access_token: expectedToken },
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: loginDto.emailOrUsername },
          { username: loginDto.emailOrUsername },
        ],
      });

      expect(Util.comparePassword).toHaveBeenCalledWith(
        user,
        loginDto.password,
      );

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id });
      expect(userRepository.save).toHaveBeenCalledWith(userSave);
    });

    it('should return an error message when user is not found', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'password',
      };
      const user = new User();
      user.id = 1;
      const errorMessage = 'Invalid email/username or password';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await controller.login(loginDto, response);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(errorMessage);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: [
            { email: loginDto.emailOrUsername },
            { username: loginDto.emailOrUsername },
          ],
        });
      }
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
      jest.spyOn(Util, 'comparePassword').mockResolvedValueOnce(false);

      try {
        await controller.login(loginDto, response);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(errorMessage);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: [
            { email: loginDto.emailOrUsername },
            { username: loginDto.emailOrUsername },
          ],
        });

        expect(Util.comparePassword).toHaveBeenCalledWith(
          user,
          loginDto.password,
        );
      }
    });
  });
});
