import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  saltRounds: number;

  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.saltRounds = 10;
  }

  async login(emailOrUsername: string, password: string) {
    const user = await this.userService.findByEmailOrUsername(emailOrUsername);

    if (!user || !(await this.comparePassword(user, password))) {
      throw new Error('Invalid email/username or password');
    }

    await this.expireOldDevices(user.id);

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: '',
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(user.password, password);
  }

  async expireOldDevices(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const devices = await this.authRepository.find({
      where: { user },
    });
    if (devices) {
      this.authRepository.remove(devices);
    }
  }
}
