import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AppConfigModule } from './config';
// import { DatabaseModule } from './database/database';
import { DatabaseModule } from './database/database.module';
import { UserPrismaModule } from './user_prisma/user_prisma.module';
import { AppI18nModule } from './i18n/i18n.module';

@Module({
  imports: [
    AppConfigModule, // loads env vars with validation
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

    AppI18nModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
