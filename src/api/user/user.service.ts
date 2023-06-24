import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { AuthService } from 'src/api/auth/auth.service';
import { WalletService } from 'src/api/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly walletService: WalletService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      firstName,
      lastName,
      dateOfBirth,
      streetAddress,
      city,
      province,
      telephoneNumber,
      email,
      username,
      password,
    } = createUserDto;

    // Check if username is unique
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username is already taken');
    }

    // Create a new User entity
    const user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;
    user.streetAddress = streetAddress;
    user.city = city;
    user.province = province;
    user.telephoneNumber = telephoneNumber;
    user.email = email;
    user.username = username;
    user.password = await this.authService.hashPassword(password);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error('Failed to save user to the database');
    }

    await this.walletService.createWallet(user);

    return user;
  }

  async findById(userId: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
  }
}
