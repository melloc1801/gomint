import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PROJECT_ERROR } from "../enum/project-error.enum";
import { PROJECT_QUERY_PARAMS } from "../project.constant";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { query } = request;

    if (!query[PROJECT_QUERY_PARAMS.SLUG]) {
      throw new BadRequestException();
    }

    const project = await this.prisma.project.findFirst({
      include: { user: true, phases: true },
      where: {
        slug: { equals: query[PROJECT_QUERY_PARAMS.SLUG], mode: "insensitive" },
      },
    });

    if (!project) {
      throw new NotFoundException(PROJECT_ERROR.PROJECT_NOT_FOUND);
    }

    request.project = project;

    return true;
  }
}
