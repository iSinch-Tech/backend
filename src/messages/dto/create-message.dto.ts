import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  text: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  senderId: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  recipientId: number;
}
