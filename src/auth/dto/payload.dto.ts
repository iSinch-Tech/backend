import { Category, User } from '@prisma/client';

export type Payload = Omit<User, 'passwordHash'> & {
  category: Category;
};
