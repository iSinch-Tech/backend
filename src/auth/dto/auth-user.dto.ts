import { Payload } from './payload.dto';

export type AuthUserDto = Omit<Payload, 'categoryId'>;
