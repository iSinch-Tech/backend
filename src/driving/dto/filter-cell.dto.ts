import { RecordStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsEnum } from 'class-validator';

export class FilterCellDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  id?: number | number[];

  @IsString({ each: true })
  @IsOptional()
  date?: string | string[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  userId?: number | number[] | null;

  @IsEnum(Object.keys(RecordStatus), { each: true })
  @IsOptional()
  status?: RecordStatus | RecordStatus[];
}
