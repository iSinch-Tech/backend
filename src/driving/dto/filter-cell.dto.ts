import { RecordStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsEnum } from 'class-validator';

export class FilterCellDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  id?: number | number[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  userId?: number | number[] | null;

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  trainerId?: number | number[] | null;

  @IsEnum(Object.keys(RecordStatus), { each: true })
  @IsOptional()
  status?: RecordStatus | RecordStatus[];
}
