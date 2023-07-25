import { NotFoundException } from '@nestjs/common';

export class NewsNotFoundException extends NotFoundException {
  constructor() {
    super({ message: 'News not found', code: 3001 });
  }
}
