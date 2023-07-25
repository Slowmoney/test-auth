import { UnauthorizedException } from '@nestjs/common';

export class InvalidPasswordException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid password or email',
      code: 2002,
    });
  }
}
