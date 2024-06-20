import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Koooooonstantin',
    description: 'User login',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'qwerty',
    description: 'User password',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'firebaseToken',
    description: 'Firebase token',
  })
  firebaseToken?: string;
}
