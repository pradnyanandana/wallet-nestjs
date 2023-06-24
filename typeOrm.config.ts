import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './src/user/user.entity';
import { Auth } from './src/auth/auth.entity';
import { Wallet } from './src/wallet/wallet.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: parseInt(configService.get('DATABASE_PORT')),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [User, Auth, Wallet],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
