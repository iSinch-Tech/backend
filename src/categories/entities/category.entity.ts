import { Category } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity implements Category {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
