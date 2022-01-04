import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptService {
  async hashString(value: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(11);
      return bcrypt.hashSync(value, salt);
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async validateHashing(value: string, hashedValue: string): Promise<boolean> {
    try {
      return await bcrypt.compare(value, hashedValue);
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }
}
