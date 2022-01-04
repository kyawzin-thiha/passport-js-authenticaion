import { UserInfo } from './../../db/info.schema';
import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfoDocument } from 'src/db/info.schema';
import { LocalUser, LocalUserDocument } from 'src/db/local.schema';
import { v1 } from 'uuid';
import { UserToken, UserTokenDocument } from 'src/db/token.schema';

@Injectable()
export class LocalUserService {
  constructor(
    @InjectModel('local-users')
    private readonly LocalUser: Model<LocalUserDocument>,
  ) {}

  async getUserByUserName(userName: string): Promise<LocalUser> {
    try {
      const data = await this.LocalUser.findOne({ userName }).lean();
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async addNewUser(userName: string, password: string): Promise<LocalUser> {
    try {
      const newUser = new this.LocalUser({
        _id: v1(),
        userName,
        password,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new NotAcceptableException('UserName already exists');
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async updatePassword(_id: string, password: string): Promise<void> {
    try {
      await this.LocalUser.updateOne({ _id }, { password });
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async deleteUser(_id: string): Promise<void> {
    try {
      await this.LocalUser.deleteOne({ _id });
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }
}

@Injectable()
export class UserInfoService {
  constructor(
    @InjectModel('user-infos')
    private readonly UserInfo: Model<UserInfoDocument>,
  ) {}

  async getUserInfoByUserID(userID: string): Promise<UserInfo | null> {
    try {
      const data = await this.UserInfo.findOne({ userID }).lean();
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async addNewUserInfo(
    userID: string,
    provider: string,
    displayName: string,
  ): Promise<UserInfo> {
    try {
      const newUserInfo = new this.UserInfo({
        _id: v1(),
        userID,
        provider,
        displayName,
      });
      await newUserInfo.save();
      return newUserInfo;
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new NotAcceptableException('UserInfo already exists');
      }
      throw new InternalServerErrorException('Server Error');
    }
  }
  async editDisplayName(
    _id: string,
    userID: string,
    displayName: string,
  ): Promise<void> {
    try {
      await this.UserInfo.findOne({ _id, userID }, { displayName });
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async deleteUserInfo(_id: string, userID: string): Promise<void> {
    try {
      await this.UserInfo.deleteOne({ _id, userID });
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }
}

@Injectable()
export class UserTokenService {
  constructor(
    @InjectModel('user-tokens')
    private readonly UserToken: Model<UserTokenDocument>,
  ) {}

  async getUserToken(token: string): Promise<UserToken | null> {
    try {
      const data = await this.UserToken.findOne({ token }).lean();
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async addNewUserToken(
    userID: string,
    infoID: string,
    token: string,
  ): Promise<void> {
    try {
      const newUserToken = new this.UserToken({
        _id: v1(),
        userID,
        infoID,
        token,
      });
      await newUserToken.save();
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new NotAcceptableException('Invalid Token');
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async updateUserToken(
    userID: string,
    infoID: string,
    token: string,
  ): Promise<void> {
    try {
      await this.UserToken.updateOne({ userID, infoID }, { token });
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new NotAcceptableException('Invalid Token');
      }
      throw new InternalServerErrorException('Server Error');
    }
  }
}
