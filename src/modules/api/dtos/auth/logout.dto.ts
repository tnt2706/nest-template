import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AuthLogoutRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'required' })
  fcmToken: string;

  @ApiProperty({ default: false })
  @IsOptional()
  logoutAllDevices: boolean;
}