import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt } from 'class-validator';

export class UpdateFileDto {
  @IsBoolean()
  @ApiProperty()
  isPublic: boolean;

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  userId: number;
}
