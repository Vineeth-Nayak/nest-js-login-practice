import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserPrismaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserPrismaDto: Prisma.UserCreateInput) {
    try {
      const existingUser = await this.databaseService.user.findFirst({
        where: { email: createUserPrismaDto.email },
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with the same email',
        );
      }

      const user = await this.databaseService.user.create({
        data: createUserPrismaDto,
      });
      return user;
    } catch (error) {
      if (error.statusCode) throw new Error(error);
      console.log('error from create prisma user', error);
      throw new BadRequestException('An error occured during creation of user');
    }
  }

  async findAll(role?: 'user' | 'admin') {
    if (role) {
      return this.databaseService.user.findMany({ where: { role } });
    }
    return this.databaseService.user.findMany({ where: { role } });
  }

  async findOne(id: number) {
    return `This action returns a #${id} userPrisma`;
  }

  async update(id: number, updateUserPrismaDto: Prisma.UserUpdateInput) {
    return `This action updates a #${id} userPrisma`;
  }

  async remove(id: number) {
    return `This action removes a #${id} userPrisma`;
  }
}
