import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class NoAuthAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        return true;
    }
}
