import { ApiProperty } from '@nestjs/swagger';
import { RecordStatus, Schedule } from '@prisma/client';

export class CellEntity implements Schedule {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  userId: number | null;

  @ApiProperty()
  status: RecordStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
