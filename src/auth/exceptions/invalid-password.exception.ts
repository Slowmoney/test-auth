import { UnauthorizedException } from '@nestjs/common';

export class InvalidPasswordException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid password',
      code: 2002,
    });
  }
}
