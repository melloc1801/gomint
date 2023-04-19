import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../../prisma.service";
import { USER_ERROR } from "../enum/user-error.enum";
import { USER_QUERY_PARAMS } from "../user.constant";

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.query[USER_QUERY_PARAMS.ADDRESS]) {
      throw new BadRequestException();
    }

    const account = await this.prisma.user.findUnique({
      where: { address: request.query[USER_QUERY_PARAMS.ADDRESS] },
    });

    if (!account) {
      throw new BadRequestException(USER_ERROR.NO_SUCH_ACCOUNT);
    }

    request.account = account;

    return true;
  }
}
