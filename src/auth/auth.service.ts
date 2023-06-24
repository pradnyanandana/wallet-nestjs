import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './auth.util';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(emailOrUsername: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await comparePassword(user, password))) {
      throw new Error('Invalid email/username or password');
    }

    await this.expireOldDevices(user.id);

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    const auth = new Auth();

    auth.user = user;
    auth.token = token;

    this.authRepository.save(auth);

    return {
      access_token: token,
    };
  }

  async verifyUser(userId: number, token: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const auth = await this.authRepository.findOne({
      where: { user, token },
    });

    if (!auth) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async expireOldDevices(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

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
