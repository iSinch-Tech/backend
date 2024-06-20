import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterMessageDto {
  @IsOptional()
  @IsString({ each: true })
  text?: string | string[];

  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  senderId?: number | number[];

  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  recipientId?: number | number[];
}
