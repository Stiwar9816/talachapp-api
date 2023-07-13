import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from 'src/users/entities/user.entity';
import { UserRoles } from '../enums/user-role.enum';

export const CurrentUser = createParamDecorator(
  (roles: UserRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;
    if (!user)
      throw new InternalServerErrorException(
        `Not user inside the request - make sure that we used the AuthGuard`,
      );

    if (roles.length === 0) return user;

    for (const role of user.roles) {
        if (roles.includes(role as UserRoles)) return user;
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles}]`,
    );
  },
);
