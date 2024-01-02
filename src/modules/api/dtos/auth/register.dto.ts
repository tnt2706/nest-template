import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, MaxLength, IsNotEmpty } from "class-validator";
import { IsUnique, MatchPassword } from '@api/validators';

export class AuthRegisterRequestDTO {
  @Transform(email => email.toLowerCase())
  @ApiProperty()
  @IsEmail({}, { message: 'invalid' })
  @MaxLength(320, { message: '320' })
  @IsUnique({ table: 'auth', column: 'email' }, { message: 'auth.email.exist' })
  email: string;

  @ApiProperty()
  @MatchPassword({ message: 'auth.password.invalid' })
  @IsNotEmpty({ message: 'required' })
  password: string;

  @ApiProperty({
    description: 'Eg: Asia/Saigon or Asia/Bankok',
  })
  @MaxLength(36, { message: '36' })
  @IsNotEmpty({ message: 'required' })
  timezoneName: string;
}

export class AuthRegisterResponseDTO {
  
}