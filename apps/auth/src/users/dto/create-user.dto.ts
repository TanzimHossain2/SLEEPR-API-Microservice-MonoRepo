import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Length(4, 70)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  readonly password: string;
}
