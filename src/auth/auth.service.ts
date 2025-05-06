import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async registerUser(registerUserDto: RegisterUserDTO) {
    const { userName, displayName, email, password } = registerUserDto;

    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.userModel.findOne({ userName });
    if (existingUsername) {
      throw new BadRequestException('User name already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mongoObj = { userName, displayName, email, password: hashedPassword };

    const createUser = new this.userModel(mongoObj);

    return await createUser.save();
  }
}
