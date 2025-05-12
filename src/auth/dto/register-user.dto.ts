import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsString()
  // @IsEmail({}, { message: 'Invalid email address' })
  @IsEmail({}, { message: 'invalid_format', context: { field: 'Email' } })
  @IsNotEmpty({ message: 'field_is_required', context: { field: 'Email' } })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
