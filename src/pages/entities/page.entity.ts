import { ApiProperty } from '@nestjs/swagger';
import { Page } from '@prisma/client';

export class PageEntity implements Page {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
