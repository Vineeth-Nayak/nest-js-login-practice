import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      if (error instanceof BadRequestException) throw error;
      console.log('error from create prisma user', error);
      throw new BadRequestException('An error occured during creation of user');
    }
  }

  async findAll(role?: 'user' | 'admin') {
    const where = role ? { role } : {};
    return this.databaseService.user.findMany({ where });
  }

  async findOne(id: number) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Unexpected error in findOne:', error);
      throw new BadRequestException('Failed to fetch user');
    }
  }

  async update(id: number, updateUserPrismaDto: Prisma.UserUpdateInput) {
    try {
      const existingUser = await this.databaseService.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check if email is being changed to one that already exists
      if (updateUserPrismaDto.email) {
        const emailExists = await this.databaseService.user.findFirst({
          where: {
            email: updateUserPrismaDto.email as string,
            NOT: { id },
          },
        });

        if (emailExists) {
          throw new BadRequestException(
            `Email "${updateUserPrismaDto.email}" is already in use`,
          );
        }
      }

      const updatedUser = await this.databaseService.user.update({
        where: { id },
        data: updateUserPrismaDto,
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Unexpected error in update:', error);
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} userPrisma`;
  }
}
