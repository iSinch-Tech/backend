import { ApiProperty } from '@nestjs/swagger';
import { Partner } from '@prisma/client';

export class PartnerEntity implements Partner {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  imageId: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
