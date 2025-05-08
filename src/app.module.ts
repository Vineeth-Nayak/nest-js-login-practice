import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { AppConfigModule } from './config';
// import { DatabaseModule } from './database/database';
import { DatabaseModule } from './database/database.module';
import { UserPrismaModule } from './user_prisma/user_prisma.module';

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
    UserPrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
