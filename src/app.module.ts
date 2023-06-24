import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Auth } from './api/auth/auth.entity';
import { AuthModule } from './api/auth/auth.module';

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
          entities: [Auth],
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
