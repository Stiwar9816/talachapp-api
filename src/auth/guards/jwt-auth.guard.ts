import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const reqToken = req.connectionParams;
    if (reqToken) {
      const headers = Object.entries(reqToken).reduce((acc, [key, value]) => {
        acc[key.toLowerCase()] = value;
        return acc;
      }, {});
      return { headers };
    }

    if (req) {
      return req;
    }
  }
}
