import { ApiProperty } from '@nestjs/swagger';
import { RecordStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCellDto {
  @ApiProperty()
  @IsOptional()
  userId?: number | null;

  @IsEnum(Object.keys(RecordStatus))
  @IsOptional()
  @ApiProperty({
    enum: RecordStatus,
  })
  status?: RecordStatus;
}
