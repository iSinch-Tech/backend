import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterNewsDto {
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  @ApiProperty()
  id?: number | number[];

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty()
  title?: string | string[];

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty()
  description?: string | string[];
}
