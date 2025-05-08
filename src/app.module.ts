import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { AppConfigModule } from './config'; // from your config/index.ts
import { DatabaseModule } from './database/database';

@Module({
  imports: [
    AppConfigModule, // loads env vars with validation
    // MongooseModule.forRootAsync({
    //   imports: [AppConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get<string>('mongoUri'),
    //   }),
    //   inject: [ConfigService],
    // }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      global: true,

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
