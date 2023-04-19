import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PHASE_ERROR } from "../enum/phase-error.enum";
import { PHASE_QUERY_PARAMS } from "../phase.constant";
import { PrismaService } from "../../prisma.service";
import { Project as ProjectModel } from "@prisma/client";
import { toInteger } from "lodash";

@Injectable()
export class PhaseGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { query, project }: { query: string[]; project: ProjectModel } =
      request;
    const outerId = query[PHASE_QUERY_PARAMS.OUTER_ID];

    if (!project) {
      throw new BadRequestException();
    }

    if (isNaN(outerId)) {
      throw new BadRequestException();
    }

    const phase = await this.prisma.phase.findFirst({
      where: {
        projectId: project.id,
        outerId: toInteger(outerId),
      },
    });

    if (!phase) {
      throw new NotFoundException(PHASE_ERROR.PHASE_NOT_FOUND);
    }

    request.phase = phase;

    return true;
  }
}
