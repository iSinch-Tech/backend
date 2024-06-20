import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: '[1,2,3]',
    description: 'Question ids',
    required: false,
  })
  questions?: number[];
}
