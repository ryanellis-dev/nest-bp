import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { TypedClsStore } from '../types/cls.types';

const NS_PER_SEC = 1e9;

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP', { timestamp: true });

  constructor(private readonly cls: ClsService<TypedClsStore>) {}

  private sanitizeHeaders(headers: Record<string, any>) {
    const headersCopy = { ...headers };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (headersCopy.authorization) {
      headersCopy.authorization = 'redacted';
    }
    if (headersCopy.cookie) {
      headersCopy.cookie = 'redacted';
    }
    return headersCopy;
  }

  private customFields(req: Request) {
    const user = this.cls.get('user');
    const permissions = this.cls.get('permissions');
    const requestId = this.cls.getId();
    const reqInfo = {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      headers: { ...this.sanitizeHeaders(req.headers) },
      remoteAddress: req.socket.remoteAddress,
      remotePort: req.socket.remotePort,
    };
    return {
      requestId,
      ...(user && { user }),
      ...(permissions && { permissions }),
      req: reqInfo,
    };
  }

  use(req: Request, res: Response, next: NextFunction) {
    const time = process.hrtime();
    const customFields = this.customFields(req);
    this.logger.debug('request received', { ...customFields });
    next();
    res.on('finish', () => {
      const timeDiff = process.hrtime(time);
      const resInfo = {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        contentLength: res.get('Content-Length'),
        headers: { ...this.sanitizeHeaders(res.getHeaders() as any) },
      };
      this.logger.debug({
        message: 'response sent',
        ...customFields,
        responseTime: Math.round(
          (timeDiff[0] * NS_PER_SEC + timeDiff[1]) / 1e6,
        ), // ms
        res: resInfo,
      });
    });
  }
}
