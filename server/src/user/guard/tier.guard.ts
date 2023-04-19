import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../../prisma.service";
import { USER_ERROR } from "../enum/user-error.enum";
import { User as UserModel } from "@prisma/client";

@Injectable()
export class TierGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = context.switchToHttp().getRequest().body;
    const { user }: { user: UserModel } = request;

    const userTier = await this.prisma.tier.findFirst({
      where: { id: user.tierId },
    });

    const usingBlocked = Object.keys(body).some((bodyField) => {
      if (Array.isArray(body[bodyField]) && !body[bodyField].length) {
        return false;
      }
      return userTier.blocked.includes(bodyField);
    });

    if (usingBlocked) {
      throw new BadRequestException(USER_ERROR.NOT_APPROPRIATE_TIER);
    }

    return true;
  }
}
