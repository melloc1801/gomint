import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Project as ProjectModel, User as UserModel } from "@prisma/client";

import { PrismaService } from "../../prisma.service";
import { USER_ERROR } from "../enum/user-error.enum";

@Injectable()
export class TierProjectGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = context.switchToHttp().getRequest().body;
    const { project }: { user: UserModel; project: ProjectModel } = request;

    const projectWithUser = await this.prisma.project.findFirst({
      include: { user: true },
      where: { id: project.id },
    });

    const projectOwnerTier = await this.prisma.tier.findFirst({
      where: { id: projectWithUser.user.tierId },
    });

    const usingBlocked = Object.keys(body).some((bodyField) => {
      if (Array.isArray(body[bodyField]) && !body[bodyField].length) {
        return false;
      }
      return projectOwnerTier.blocked.includes(bodyField);
    });

    if (usingBlocked) {
      throw new BadRequestException(USER_ERROR.NOT_APPROPRIATE_TIER);
    }

    return true;
  }
}
