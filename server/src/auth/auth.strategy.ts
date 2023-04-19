import { Request } from "express";
import { Strategy } from "passport-custom";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class Web3AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!req.session.address) throw new UnauthorizedException();
    return true;
  }
}
