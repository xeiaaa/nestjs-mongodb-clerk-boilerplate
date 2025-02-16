import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/clerk-sdk-node'; // ✅ Correct import

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.split(' ')[1];
      const sessionClaims = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        audience: process.env.CLERK_FRONTEND_API!,
      });

      req['user'] = sessionClaims;
      next();
    } catch (error) {
      console.error('Auth Error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
