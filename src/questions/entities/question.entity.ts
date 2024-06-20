import { ApiProperty } from '@nestjs/swagger';
import { Category, Question } from '@prisma/client';

export class QuestionEntity implements Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  image: string;

  @ApiProperty({
    example: [{ id: 'aaaa-bbbb', text: 'I am your father...', isRigth: false }],
    description: 'Question answers',
  })
  answers: { id: string; text: string; isRigth: boolean }[];

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  categoty: Category;

  @ApiProperty()
  imageId: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
