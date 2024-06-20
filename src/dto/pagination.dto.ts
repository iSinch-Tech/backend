import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    default: 0,
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  offset = 0;

  @ApiProperty({
    type: Number,
    default: 0,
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  limit = 10;

  @ApiProperty({
    type: String,
    default: 'id',
    required: false,
  })
  @IsString()
  orderBy = 'id';

  @ApiProperty({
    default: Prisma.SortOrder.asc,
    enum: Prisma.SortOrder,
    required: false,
  })
  @IsString()
  @Transform((param) => param.value.toLowerCase())
  orderType: Prisma.SortOrder = Prisma.SortOrder.asc;

  // @ApiProperty({
  //   type: { string: orderType },
  //   isArray: true,
  //   required: false,
  // })
  // order: Record<string, orderType>[] = [{ id: orderType.ASC }];
}
