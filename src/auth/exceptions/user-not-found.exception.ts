import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({ message: 'User not found', code: 2001 });
  }
}
