import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserId } from './decorators/user-id.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: SignUpDto })
  signUp(@Body(ValidationPipe) body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  @ApiBody({ type: SignInDto })
  signIn(@Body(ValidationPipe) body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@UserId() userId: number, @Body() token: RefreshTokenDto) {
    const data = await this.authService.getUserIfRefreshTokenMatches(
      token.refreshToken,
      userId,
    );

    if (!data) return null;

    return this.authService.getNewAccessAndRefreshToken({ userId: data.id });
  }
}
