import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@prisma/client';

export class MessageEntity implements Message {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  recipientId: number;

  @ApiProperty()
  senderId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
