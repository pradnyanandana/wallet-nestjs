import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Auth } from './api/auth/auth.entity';
import { AuthModule } from './api/auth/auth.module';
import { User } from './api/user/user.entity';
import { UserModule } from './api/user/user.module';
import { WalletModule } from './api/wallet/wallet.module';
import { Wallet } from './api/wallet/wallet.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        return {
          type: 'mysql',
          host: cs.get('DATABASE_HOST'),
          port: cs.get('DATABASE_PORT'),
          username: cs.get('DATABASE_USERNAME'),
          password: cs.get('DATABASE_PASSWORD'),
          database: cs.get('DATABASE_NAME'),
          synchronize: true,
          entities: [Auth, User, Wallet],
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    UserModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
