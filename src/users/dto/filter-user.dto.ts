import { UserRole, UserStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, IsOptional } from 'class-validator';

export class FilterUserDto {
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  id?: number | number[];

  @IsString({ each: true })
  @IsOptional()
  login?: string | string[];

  @IsString({ each: true })
  @IsOptional()
  name?: string | string[];

  @IsEnum(Object.keys(UserRole), { each: true })
  @IsOptional()
  role?: UserRole | UserRole[];

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  categoryId?: number | number[];

  @IsEnum(Object.keys(UserStatus), { each: true })
  @IsOptional()
  status?: UserStatus | UserStatus[];

  @IsString({ each: true })
  @IsOptional()
  phone?: string | string[];

  @IsOptional()
  birthdate?: Date;

  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  driverLicenseId?: number | number[];

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  trainerId?: number;
}
