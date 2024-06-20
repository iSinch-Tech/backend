import { ApiProperty } from '@nestjs/swagger';

export class PagintaionResponseDto<T> {
  @ApiProperty()
  count: number;

  @ApiProperty()
  rows: T[];
}
