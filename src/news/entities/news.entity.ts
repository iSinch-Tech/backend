import { ApiProperty } from '@nestjs/swagger';
import { News } from '@prisma/client';

export class NewsEntity implements News {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  images: number[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
