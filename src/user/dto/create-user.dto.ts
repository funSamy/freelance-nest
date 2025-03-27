import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'The email is invalid' })
  readonly email: string;

  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6, { message: 'The minium length should be 6 characters' })
  readonly password: string;
}
