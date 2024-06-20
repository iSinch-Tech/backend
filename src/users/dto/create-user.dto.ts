import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsEnum(Object.keys(UserRole))
  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  categoryId?: number;

  @IsOptional()
  @ApiProperty()
  firebaseToken?: string[];

  @IsEnum(Object.keys(UserStatus))
  @IsOptional()
  @ApiProperty({
    enum: UserStatus,
  })
  status?: UserStatus;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty()
  birthdat?: Date;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  driverLicenseId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  trainerId?: number;
}
