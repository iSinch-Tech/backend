// import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterFileDto {
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  // @ApiProperty({ required: false })
  userId?: number | number[];

  @IsOptional()
  @IsString({ each: true })
  // @ApiProperty({ required: false })
  name?: string | string[];

  @IsOptional()
  @IsString({ each: true })
  // @ApiProperty({ required: false })
  type?: string | string[];
}
