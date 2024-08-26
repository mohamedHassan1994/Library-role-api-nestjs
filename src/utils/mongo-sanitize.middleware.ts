/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as mongoSanitize from 'express-mongo-sanitize';

@Injectable()
export class MongoSanitizeMiddleware implements NestMiddleware {
  private readonly sanitizer;

  constructor() {
    this.sanitizer = mongoSanitize({
      replaceWith: '_',
      allowDots: true,
    });
  }

  use(req: any, res: any, next: () => void) {
    this.sanitizer(req, res, next);
  }
}
