import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CurrentUserRequest } from 'src/users/interceptors/current-user.interceptor';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();

    return !!request.session.userId;
  }
}
