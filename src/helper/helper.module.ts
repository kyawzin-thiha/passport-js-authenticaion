if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { LocalUserSchema } from 'src/db/local.schema';
import { UserInfoSchema } from 'src/db/info.schema';
import { UserTokenSchema } from 'src/db/token.schema';
import { JwtService } from './services/jwt.service';
import {
  LocalUserService,
  UserInfoService,
  UserTokenService,
} from './services/auth-db.service';
import { BcryptService } from './services/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'local-users',
        schema: LocalUserSchema,
      },
      {
        name: 'user-infos',
        schema: UserInfoSchema,
      },
      {
        name: 'user-tokens',
        schema: UserTokenSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [
    JwtService,
    LocalUserService,
    UserInfoService,
    UserTokenService,
    BcryptService,
  ],
  exports: [
    JwtService,
    LocalUserService,
    UserInfoService,
    UserTokenService,
    BcryptService,
  ],
})
export class HelperModule {}
