import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/api/auth/auth.controller';
import { AuthService } from '../src/api/auth/auth.service';

describe('AuthService', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return user data without password on successful login', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: '123',
        email: 'test@example.com',
        password: 'password123',
        access_token: 'token',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(user);
      jest.spyOn(authService, 'expireOldDevices').mockResolvedValue();

      const result = await controller.login(loginDto);

      expect(result).toEqual({ id: '123', email: 'test@example.com' });
      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.expireOldDevices).toHaveBeenCalledWith('123');
    });

    it('should return error message on failed login', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'invalidpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Invalid email/username or password'));

      const result = await controller.login(loginDto);

      expect(result).toEqual({ error: 'Invalid email/username or password' });
      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'invalidpassword',
      );
      expect(authService.expireOldDevices).not.toHaveBeenCalled();
    });
  });
});
