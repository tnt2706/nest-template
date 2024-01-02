import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthResponseDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  timezoneName: string;
}

export * from './active.dto';
export * from './login.dto';
export * from './logout.dto';
export * from './password.dto';
export * from './register.dto';
export * from './refresh.dto';