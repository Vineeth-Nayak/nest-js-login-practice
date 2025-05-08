import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserPrismaService } from './user_prisma.service';
import { Prisma } from 'generated/prisma';

@Controller('user-prisma')
export class UserPrismaController {
  constructor(private readonly userPrismaService: UserPrismaService) {}

  @Post()
  create(@Body() createUserPrismaDto: Prisma.UserCreateInput) {
    return this.userPrismaService.create(createUserPrismaDto);
  }

  @Get()
  findAll(@Query() role?: 'user' | 'admin') {
    return this.userPrismaService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPrismaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPrismaDto: Prisma.UserUpdateInput,
  ) {
    return this.userPrismaService.update(+id, updateUserPrismaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPrismaService.remove(+id);
  }
}
