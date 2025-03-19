import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/users.entity';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request & { currentUser: User } = context
      .switchToHttp()
      .getRequest();

    if (!request.currentUser) {
      return false;
    }

    return request.currentUser.admin;
  }
}
