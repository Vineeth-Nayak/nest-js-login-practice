import { Module } from '@nestjs/common';
import { UserPrismaService } from './user_prisma.service';
import { UserPrismaController } from './user_prisma.controller';

@Module({
  controllers: [UserPrismaController],
  providers: [UserPrismaService],
})
export class UserPrismaModule {}
