import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import { InvalidPasswordException } from './exceptions/invalid-password.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(data: SignUpDto) {
    try {
      const user = new User();

      user.email = data.email;
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(data.password, user.salt);

      await this.userRepository.save(user);

      return {
        result: true,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async signIn(data: SignInDto) {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) throw new UserNotFoundException();

    const isPasswordValid = await this.validatePassword(
      data.password,
      user.password,
    );
    if (!isPasswordValid) throw new InvalidPasswordException();

    const tokens = await this.getNewAccessAndRefreshToken({ userId: user.id });

    return {
      ...tokens,
      userId: user.id,
    };
  }

  async getNewAccessAndRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.getRefreshToken(payload);
    await this.updateRefreshTokenInUser(refreshToken, payload.userId);

    return {
      accessToken: await this.getAccessToken(payload),
      refreshToken: refreshToken,
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      await this.updateRefreshTokenInUser(null, userId);
      return user;
    } else {
      return null;
    }
  }

  async updateRefreshTokenInUser(refreshToken: string, userId: number) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }

    await this.userRepository.update(
      { id: userId },
      {
        hashedRefreshToken: refreshToken,
      },
    );
  }

  getAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  getRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
