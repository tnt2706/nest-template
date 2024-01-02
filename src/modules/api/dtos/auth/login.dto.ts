import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { AuthResponseDTO } from "@api/dtos";

export class AuthLoginRequestDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'invalid' })
  @Transform(email => email.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'required' })
  password: string;

  @ApiProperty()
  @IsOptional()
  fcmToken: string;
}

@Exclude()
export class AuthLoginResponseDTO {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  accessTokenExpires: number;

  @Expose()
  @ApiProperty()
  refreshToken: string;

  @Expose()
  @ApiProperty()
  refreshTokenExpires: number;

  @Expose()
  @ApiProperty({ type: () => AuthResponseDTO })
  auth: AuthResponseDTO;

  toJSON() {
    this.auth = plainToClass(AuthResponseDTO, this.auth);
    return plainToClass(AuthLoginResponseDTO, this);
  }
}