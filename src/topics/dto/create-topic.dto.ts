import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: '[1,2,3]',
    description: 'Question ids',
    required: false,
  })
  questions?: number[];
}
