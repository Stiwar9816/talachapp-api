import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, connection } = ctx.getContext();

    if (req) {
    //   return req;
    
    // Obtén el token de autorización del objeto connectionParamsParams
    const headers = Object.entries(req.connectionParams).reduce(
      (acc, [key, value]) => {
        acc[key.toLowerCase()] = value;
        return acc;
      },
      {},
      );
      console.log(headers)
      return headers;
    }
  }
}
