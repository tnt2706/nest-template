import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthActiveRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'required' })
  id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'required' })
  token: string;
}