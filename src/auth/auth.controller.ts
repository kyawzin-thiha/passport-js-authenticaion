import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/decorator/isPublic.decorator';
import { GitHubGuard } from 'src/guard/github.guard';
import { LocalGuard } from 'src/guard/local.guard';
import { UserTokenService } from 'src/helper/services/auth-db.service';
import { JwtService } from 'src/helper/services/jwt.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly JwtServiceProvider: JwtService,
    private readonly UserTokenServiceProvider: UserTokenService,
  ) {}

  @Get('/github')
  @UseGuards(GitHubGuard)
  async login() {
    // github cb
  }

  @Get('/github/callback')
  @UseGuards(GitHubGuard)
  async GitHubCB(@Req() req: any, @Res() res: Response) {
    const token = this.JwtServiceProvider.generateToken(req.user);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      signed: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    res.redirect(process.env.REDIRECT_URL);
  }

  @UseGuards(LocalGuard)
  @Post('/local')
  LocalLogIn(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const token = this.JwtServiceProvider.generateToken(req.user);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      signed: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return true;
  }

  @Get('/local-key')
  async logInWithLocalKey(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
    @Body('token') token: string,
  ) {
    const data = await this.UserTokenServiceProvider.getUserToken(token);
    if (!data) {
      throw new ForbiddenException('Invalid User');
    }
    const jwtToken = this.JwtServiceProvider.generateToken({
      userID: data.userID,
      infoID: data.infoID,
    });
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: false,
      signed: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return true;
  }
}
