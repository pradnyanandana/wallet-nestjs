import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateUserDto, Province } from 'src/api/user/user.dto';
import { UserService } from 'src/api/user/user.service';
import { User } from 'src/api/user/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        EntityManager,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      streetAddress: '123 Main St',
      city: 'City',
      province: Province.Bali,
      telephoneNumber: '1234567890',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
    };

    const existingUser: User = {
      id: 1,
      firstName: 'Existing',
      lastName: 'User',
      dateOfBirth: new Date(),
      streetAddress: '456 Street Ave',
      city: 'City',
      province: 'Province',
      telephoneNumber: '9876543210',
      email: 'existing@example.com',
      username: 'existinguser',
      password: 'existingpassword',
      token: 'existingtoken',
      registrationDate: new Date(),
    };

    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const createdUser = await userService.createUser(createUserDto);

      expect(createdUser).toBeDefined();
      expect(createdUser.username).toBe(createUserDto.username);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if username is already taken', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        'Username is already taken',
      );

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: createUserDto.username,
      });
    });

    it('should throw an error if saving user and wallet fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      jest
        .spyOn(entityManager, 'transaction')
        .mockRejectedValue(new Error('Failed to save'));

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        'Failed to save user to the database',
      );

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: createUserDto.username,
      });

      expect(entityManager.transaction).toHaveBeenCalledTimes(1);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
