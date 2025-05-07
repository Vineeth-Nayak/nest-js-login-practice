import { IsEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsEmpty()
  @IsString()
  email: string;

  @IsEmpty()
  @IsString()
  password: string;
}
