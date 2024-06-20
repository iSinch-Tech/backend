import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';

export class FileEntity implements File {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  size: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
