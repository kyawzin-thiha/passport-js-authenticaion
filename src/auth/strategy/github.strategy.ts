if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { UserInfo } from 'src/db/info.schema';
import { UserInfoService } from 'src/helper/services/auth-db.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserInfoServiceProvider: UserInfoService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CLIENT_CALLBACK,
    });
  }

  async validate(
    _: undefined,
    __: undefined,
    profile: { id: string; displayName: string },
  ) {
    let userData: UserInfo;
    userData = await this.UserInfoServiceProvider.getUserInfoByUserID(
      profile.id,
    );
    if (!userData) {
      userData = await this.UserInfoServiceProvider.addNewUserInfo(
        profile.id,
        'GitHub',
        profile.displayName,
      );
    }
    return {
      userID: userData.userID,
      infoID: userData._id,
    };
  }
}
