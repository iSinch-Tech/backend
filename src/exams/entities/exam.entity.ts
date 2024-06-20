import { ApiProperty } from '@nestjs/swagger';
import { Exam, ExamStatus, ExamType } from '@prisma/client';

export class ExamEntity implements Exam {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  time: number;

  @ApiProperty()
  answers: { questionId: number; answerId: string }[];

  @ApiProperty()
  type: ExamType;

  @ApiProperty()
  status: ExamStatus;

  @ApiProperty()
  entityId: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
