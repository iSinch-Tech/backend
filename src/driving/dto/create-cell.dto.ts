import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCellDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  count?: number;
}
