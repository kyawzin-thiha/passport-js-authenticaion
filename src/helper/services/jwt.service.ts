import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
type JwtPayload = {
  userID: string;
  infoID: string;
};

@Injectable()
export class JwtService {
  constructor(private readonly JwtService: Jwt) {}

  generateToken(payload: JwtPayload): string {
    return this.JwtService.sign(payload, {
      algorithm: 'HS256',
      expiresIn: 60 * 60 * 24 * 7,
      issuer: 'nest-jwt',
    });
  }
}
