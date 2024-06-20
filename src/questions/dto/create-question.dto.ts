import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  text?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  image?: string;

  @IsNotEmpty()
  @ApiProperty({
    example: [{ id: 'aaaa-bbbb', text: 'I am your father...', isRigth: false }],
    description: 'Question answers',
  })
  answers: { id: string; text: string; isRigth: boolean }[];

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;
}
