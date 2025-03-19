import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../users.entity';
import { Request, Response } from 'express';

declare module 'express' {
  interface Request {
    currentUser?: User | null;
    session?: {
      userId: number;
    };
  }
}

@Injectable()
export class CurrentUserMiddlware implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }
}
