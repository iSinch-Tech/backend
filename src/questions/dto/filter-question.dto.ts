import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterQuestionDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  id?: number | number[];

  @IsString({ each: true })
  @IsOptional()
  name?: string | string[];

  @IsString({ each: true })
  @IsOptional()
  text?: string | string[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  categoryId?: number | number[];
}
