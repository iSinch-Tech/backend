import { ApiProperty } from '@nestjs/swagger';
import { ExamStatus, ExamType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class FilterExamDto {
  @IsEnum(Object.keys(ExamType), { each: true })
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ExamType,
  })
  type?: ExamType | ExamType[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  entityId?: number | number[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  userId?: number | number[];

  @IsEnum(Object.keys(ExamStatus), { each: true })
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ExamStatus,
  })
  status?: ExamStatus | ExamStatus[];
}
