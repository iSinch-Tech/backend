import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  value: string;
}
