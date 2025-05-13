import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsString({ message: 'is_string', context: { field: 'user_name' } })
  @IsNotEmpty({ message: 'field_is_required', context: { field: 'user_name' } })
  userName: string;

  @IsString({ message: 'is_string', context: { field: 'display_name' } })
  @IsNotEmpty({
    message: 'field_is_required',
    context: { field: 'display_name' },
  })
  displayName: string;

  // @IsEmail({}, { message: 'Invalid email address' })
  @IsEmail({}, { message: 'invalid_format', context: { field: 'email' } })
  @IsString({ message: 'is_string', context: { field: 'email' } })
  @IsNotEmpty({ message: 'field_is_required', context: { field: 'email' } })
  email: string;

  @MinLength(8, { message: 'minLength', context: { field: 'password' } })
  @IsString({ message: 'is_string', context: { field: 'password' } })
  @IsNotEmpty({ message: 'field_is_required', context: { field: 'password' } })
  password: string;
}
