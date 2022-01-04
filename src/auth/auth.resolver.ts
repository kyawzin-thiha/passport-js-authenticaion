import { ForbiddenException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorator/CurrentUser.decorator';
import { Public } from 'src/decorator/isPublic.decorator';
import { UserInfoJwtData } from 'src/dto/types';
import { UserArgs } from 'src/dto/user.args';
import {
  LocalUserService,
  UserInfoService,
  UserTokenService,
} from 'src/helper/services/auth-db.service';
import { BcryptService } from 'src/helper/services/bcrypt.service';
import { UserModel } from 'src/model/user.model';
import { v5 } from 'uuid';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(
    private readonly UserInfoServiceProvider: UserInfoService,
    private readonly LocalUserServiceProvider: LocalUserService,
    private readonly BcryptServiceProvider: BcryptService,
    private readonly UserTokenServiceProvider: UserTokenService,
  ) {}

  @Query(() => UserModel)
  async getUserInfo(@CurrentUser() user: UserInfoJwtData) {
    const data = await this.UserInfoServiceProvider.getUserInfoByUserID(
      user.userID,
    );
    if (!data) {
      throw new ForbiddenException('Not Authorized');
    }
    return data;
  }

  @Query(() => Boolean)
  isAuthenticated() {
    return true;
  }

  @Public()
  @Mutation(() => Boolean)
  async addNewUser(@Args() input: UserArgs) {
    const hashedPsw = await this.BcryptServiceProvider.hashString(
      input.password,
    );
    const data = await this.LocalUserServiceProvider.addNewUser(
      input.userName,
      hashedPsw,
    );
    const info = await this.UserInfoServiceProvider.addNewUserInfo(
      data._id,
      'Local',
      input.displayName,
    );
    const token = v5(data.password, info._id);
    await this.UserTokenServiceProvider.addNewUserToken(
      info.userID,
      info._id,
      token,
    );
    return true;
  }

  @Mutation(() => Boolean)
  async updateUserPassword(
    @Args('password') password: string,
    @CurrentUser() user: UserInfoJwtData,
  ) {
    const hashedPsw = await this.BcryptServiceProvider.hashString(password);
    await this.LocalUserServiceProvider.updatePassword(user.userID, hashedPsw);
    const token = v5(hashedPsw, user.infoID);
    await this.UserTokenServiceProvider.updateUserToken(
      user.userID,
      user.infoID,
      token,
    );
    return true;
  }
}
