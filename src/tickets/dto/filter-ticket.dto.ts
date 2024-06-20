import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterTicketDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  id?: number | number[];

  @IsString({ each: true })
  @IsOptional()
  name?: string | string[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  categoryId?: number | number[];
}
