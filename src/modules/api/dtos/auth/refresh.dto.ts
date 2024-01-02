import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AuthRefreshTokenRequestDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}

export class AuthRefreshTokenResponseDTO {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  accessTokenExpires: number;
}