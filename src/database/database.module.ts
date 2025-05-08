import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { models } from '../schemas';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(models),
  ],
  providers: [DatabaseService], // Prisma service
  exports: [MongooseModule, DatabaseService], // expose both prisma and mongoose
})
export class DatabaseModule {}
