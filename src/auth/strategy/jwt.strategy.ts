if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

export type JwtPayload = {
  userID: string;
  infoID: string;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.signedCookies) {
          token = req.signedCookies['jwt'];
        }
        return token;
      },
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
