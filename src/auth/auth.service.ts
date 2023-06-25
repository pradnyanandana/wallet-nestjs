import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './auth.util';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(emailOrUsername: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await comparePassword(user, password))) {
      throw new UnauthorizedException('Invalid email/username or password');
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    user.token = token;
    await this.userRepository.save(user);

    return {
      access_token: token,
    };
  }

  async verifyUser(userId: number, token: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, token },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    user.token = undefined;
    user.password = undefined;

    return user;
  }
}
