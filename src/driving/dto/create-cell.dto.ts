import { ApiProperty } from '@nestjs/swagger';
import { RecordStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCellDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  userId?: number | null;

  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  trainerId: number;

  @IsEnum(Object.keys(RecordStatus))
  @IsOptional()
  @ApiProperty({
    enum: RecordStatus,
  })
  status?: RecordStatus;

  @IsOptional()
  @ApiProperty()
  comment?: string;
}
