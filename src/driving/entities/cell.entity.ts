import { ApiProperty } from '@nestjs/swagger';
import { DriveSchedule, RecordStatus } from '@prisma/client';

export class CellEntity implements DriveSchedule {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  userId: number | null;

  @ApiProperty()
  trainerId: number | null;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  status: RecordStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
