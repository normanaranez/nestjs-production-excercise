import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserRequest } from '../interceptors/current-user.interceptor';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();
    return request.currentUser;
  },
);
