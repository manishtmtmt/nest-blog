import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) throw new UnauthorizedException();

    const { ...res } = user;
    const { password, ...result } = res['_doc'];
    return this.login(result);
  }

  async login(user: any) {
    const payload = { sub: user['_id'] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async jwtVerify(token: string) {
    const user = await this.jwtService.verify(token);
    return user;
  }
}
