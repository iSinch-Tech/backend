import { ApiProperty } from '@nestjs/swagger';
import { Category, Question, Ticket } from '@prisma/client';

export class TicketEntity implements Ticket {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  category: Category;

  @ApiProperty()
  questions: Question[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
