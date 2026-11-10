import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestWithId } from './request-id.middleware';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    const requestId = (req as RequestWithId).id ?? 'missing-request-id';

    res.on('finish', () => {
      const elapsed = Date.now() - startedAt;
      this.logger.log(
        `[${requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`,
      );
    });
    next();
  }
}
