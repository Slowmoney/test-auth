import { NotFoundException } from '@nestjs/common';

export class DontAccessNewsException extends NotFoundException {
  constructor() {
    super({ message: 'Dont access to news', code: 3002 });
  }
}
