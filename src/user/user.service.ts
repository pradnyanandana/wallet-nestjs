import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { createHash } from 'crypto';
import { hashPassword } from '../auth/auth.util';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly entityManager: EntityManager,
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
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username / email is already taken');
    }

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
    user.password = await hashPassword(password);
    user.registrationDate = new Date();

    const data = `${user.username}:${user.email}`;
    const address = createHash('sha256').update(data).digest('hex');

    const wallet = new Wallet();

    wallet.user = user;
    wallet.balance = 0;
    wallet.address = address;

    try {
      // Save user and wallet within the transaction
      await this.entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(user);
        await transactionManager.save(wallet);
      });
    } catch (error) {
      throw new Error('Failed to save user to the database');
    }

    return user;
  }
}
