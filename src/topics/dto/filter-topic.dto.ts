import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterTopicDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  id?: number | number[];

  @IsString({ each: true })
  @IsOptional()
  name?: string | string[];
}
