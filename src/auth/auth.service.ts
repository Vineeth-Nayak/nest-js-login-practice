import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

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

  async loginUser(loginUserDto: LoginUserDTO) {
    const { email, password } = loginUserDto;

    const existingEmail = await this.userModel.findOne({ email });
    if (!existingEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const result = await bcrypt.compare(password, existingEmail.password);
    if (result) {
      const { accessToken, refreshToken } = await this.generateJWT(
        existingEmail._id.toString(),
      );

      return { message: 'logged in', data: { accessToken, refreshToken } };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  // helper function to generateJWT
  async generateJWT(userId: string, needBoth = true) {
    const accessToken = this.jwtService.sign({ userId });

    if (!needBoth) return { accessToken };
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(payload.userId);

      if (!user) throw new UnauthorizedException();

      // const newAccessToken = this.jwtService.sign({ userId: user._id });
      const { accessToken } = await this.generateJWT(
        user._id.toString(),
        false,
      );

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
