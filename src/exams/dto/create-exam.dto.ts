import { ApiProperty } from '@nestjs/swagger';
import { ExamType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExamDto {
  @IsNotEmpty()
  @IsEnum(Object.keys(ExamType))
  @ApiProperty({ enum: ExamType })
  type: ExamType;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  entityId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  userId: number;
}
