import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterPartnerDto {
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
  url?: string | string[];

  @IsOptional()
  @IsInt({ each: true })
  @ApiProperty()
  imageId?: number | number[];
}
