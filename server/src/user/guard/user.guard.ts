import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../../prisma.service";
import { USER_ERROR } from "../enum/user-error.enum";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId }: { userId: number } = request.session;

    if (!userId) {
      throw new BadRequestException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    if (user.banned) {
      throw new BadRequestException(USER_ERROR.BANNED);
    }

    request.user = user;

    return true;
  }
}
