import { ApiProperty } from '@nestjs/swagger';
import { Category, User, UserRole, UserStatus } from '@prisma/client';

export class UserEntity implements Omit<User, 'passwordHash'> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  passwordHash: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  categoty: Category;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  firebaseToken: string[];

  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  driverLicenseId: number | null;

  @ApiProperty()
  trainerId: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
