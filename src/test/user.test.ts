import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../api/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../api/user/user.entity';
import { CreateUserDto, Province } from '../api/user/user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      // Mocked user data
      const createUserDto: CreateUserDto = {
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
      };

      // Mock the repository save method
      const saveMock = jest.fn().mockResolvedValue(createUserDto as User);
      userRepository.save = saveMock;

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(saveMock).toBeCalledWith(createUserDto);
    });

    it('should throw an error if username is already taken', async () => {
      // Mocked user data
      const createUserDto: CreateUserDto = {
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
      };

      // Mock the repository findOne method to return an existing user
      const findOneMock = jest
        .fn()
        .mockResolvedValue({ username: 'johndoe' } as User);
      userRepository.findOne = findOneMock;

      // Expect an error to be thrown
      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        'Username is already taken',
      );
      expect(findOneMock).toBeCalledWith({ username: createUserDto.username });
    });

    it('should throw an error if failed to save user', async () => {
      // Mocked user data
      const createUserDto: CreateUserDto = {
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
      };

      // Mock the repository save method to throw an error
      const saveMock = jest
        .fn()
        .mockRejectedValue(new Error('Failed to save user'));
      userRepository.save = saveMock;

      // Expect an error to be thrown
      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        'Failed to save user to the database',
      );

      expect(saveMock).toBeCalledWith(createUserDto);
    });
  });
});
