import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  url: string;

  @IsInt()
  @ApiProperty()
  imageId: number | null;
}
