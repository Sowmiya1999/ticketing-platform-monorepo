import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const adminApiKey = process.env.ADMIN_API_KEY;
    const requestApiKey = req.headers['x-api-key'];

    if (requestApiKey !== adminApiKey) {
      throw new UnauthorizedException('Invalid or missing admin API key');
    }

    next();
  }
}
