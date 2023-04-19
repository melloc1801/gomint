import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";

import { AuthGuard } from "src/auth/guard/auth.guard";
import { CreateReportDto } from "./dto/create-report.dto";
import { GetProject } from "src/project/decorator/get-project.decorator";
import { GetUser } from "src/user/decorator/get-user.decorator";
import { ProjectGuard } from "src/project/guard/project.guard";
import { ReportService } from "./report.service";
import { UserGuard } from "src/user/guard/user.guard";
import { User as UserModel, Project as ProjectModel } from "@prisma/client";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard, UserGuard, ProjectGuard)
  @Post()
  create(
    @Body() createReportDto: CreateReportDto,
    @GetProject() project: ProjectModel,
    @GetUser() user: UserModel
  ): Promise<void> {
    return this.reportService.create(createReportDto, user.id, project.id);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard)
  @Delete()
  remove(
    @GetProject() project: ProjectModel,
    @GetUser() user: UserModel
  ): Promise<void> {
    return this.reportService.remove(user.id, project.id);
  }
}
