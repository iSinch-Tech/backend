import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from './jwt.guard';

export const RoleGuard = (roles: UserRole | UserRole[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return roles.includes(user?.role);
    }
  }

  return mixin(RoleGuardMixin);
};
