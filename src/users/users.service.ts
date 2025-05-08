import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserQueryDTO } from './dto/get-user-query.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(queryParams: UserQueryDTO) {
    const { email, userName, displayName, skip = 0, page = 1 } = queryParams;

    const filter: any = {};
    if (email) filter.email = email;
    if (userName) filter.userName = userName;
    if (displayName) filter.displayName = displayName;

    const limit = 10;
    const finalSkip = skip || (page - 1) * limit;

    const users = await this.userModel
      .find(filter)
      .select('-password')
      .skip(finalSkip)
      .limit(limit);
    const response = { data: users };
    return response;
  }

  async getUserId(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
