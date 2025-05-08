import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { models } from '../schemas';

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
  exports: [MongooseModule],
})
export class DatabaseModule {}
