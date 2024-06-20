import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AnswersExamDto {
  @IsNotEmpty()
  @ApiProperty({
    example: [{ questionId: 1, answerId: 'aaaa-bbbb' }],
    description: 'Question answers',
  })
  answers: { questionId: number; answerId: string }[];

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    example: 100,
    description: 'Exam time',
  })
  time: number;
}
