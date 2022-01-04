import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HelperModule } from 'src/helper/helper.module';
import { GitHubStrategy } from './strategy/github.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [PassportModule, HelperModule],
  providers: [GitHubStrategy, LocalStrategy, JwtStrategy, AuthResolver],
  controllers: [AuthController],
})
export class AuthModule {}
