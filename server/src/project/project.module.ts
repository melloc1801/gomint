import { ProjectController, ProjectsController } from "./project.controller";

import { Module } from "@nestjs/common";
import { PhaseService } from "src/phase/phase.service";
import { PrismaService } from "../prisma.service";
import { ProjectService } from "./project.service";

@Module({
  providers: [ProjectService, PrismaService, PhaseService],
  controllers: [ProjectsController, ProjectController],
  imports: [],
})
export class ProjectModule {}
