import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '@prisma/client';

export class TopicEntity implements Topic {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
