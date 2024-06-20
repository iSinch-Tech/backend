import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

export const UserData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUserDto;
  },
);
