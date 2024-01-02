import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { MatchPassword } from "@api/validators";

export class AuthCreatePasswordResetRequestDTO {
  @Expose()
  @ApiProperty()
  email: string;
}

export class AuthGetPasswordResetRequestDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  token: string;
}

export class AuthUpdatePasswordResetRequestDTO {
  @Expose()
  @ApiProperty()
  @MatchPassword({ message: 'auth.password.invalid' })
  @IsNotEmpty({ message: 'required' })
  password: string;
}

export class SendEmailActiveDTO {
  email: string;
  id: string;
  token: string;
}

export class SendEmailPasswordResetDTO {
  email: string;
  id: string;
  token: string;
}