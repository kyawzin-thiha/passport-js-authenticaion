import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotAcceptableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import {
  LocalUserService,
  UserInfoService,
} from 'src/helper/services/auth-db.service';
import { BcryptService } from 'src/helper/services/bcrypt.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly LocalUserServiceProvider: LocalUserService,
    private readonly BcryptServiceProvider: BcryptService,
    private readonly UserInfoServiceProvider: UserInfoService,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    const userData = await this.LocalUserServiceProvider.getUserByUserName(
      username,
    );
    if (!userData) {
      throw new NotAcceptableException('UserName or Password is incorrect');
    }
    const isPswValid = await this.BcryptServiceProvider.validateHashing(
      password,
      userData.password,
    );
    if (!isPswValid) {
      throw new NotAcceptableException('UserName or Password is incorrect');
    }
    const userInfo = await this.UserInfoServiceProvider.getUserInfoByUserID(
      userData._id,
    );
    if (!userInfo) {
      throw new InternalServerErrorException(
        'Error Occur while creating your account. Please create new one',
      );
    }
    return {
      userID: userInfo.userID,
      infoID: userInfo.userID,
    };
  }
}
