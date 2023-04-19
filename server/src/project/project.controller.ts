import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User as UserModel, Project as ProjectModel } from "@prisma/client";

import { AuthGuard } from "src/auth/guard/auth.guard";
import { CreateProjectDto } from "./dto/project.create.dto";
import { GetProject } from "./decorator/get-project.decorator";
import { GetUser } from "../user/decorator/get-user.decorator";
import { PROJECT_QUERY_PARAMS } from "./project.constant";
import { ProjectOwnerGuard } from "./guard/project-owner.guard";
import { ProjectControllerGuard } from "./guard/project-controller.guard";
import { ProjectService } from "./project.service";
import { UpdateProjectDto } from "./dto/project.update.dto";
import { UserGuard } from "src/user/guard/user.guard";
import { GetProjectDto } from "./dto/get-project.dto";
import { GetProjectIsController } from "./decorator/get-project-is-controller.decorator ";
import { GetProjectIsOwner } from "./decorator/get-project-is-owner.decorator";
import { TierGuard } from "src/user/guard/tier.guard";
import { TierProjectGuard } from "src/user/guard/tier-project.guard";
import { PHASE_QUERY_PARAMS } from "src/phase/phase.constant";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("project")
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async findBySlug(
    @Query(PROJECT_QUERY_PARAMS.SLUG) slug: string,
    @Query(PHASE_QUERY_PARAMS.PHASE_NAME) phaseName: string,
    @Session() session: Record<string, unknown>
  ): Promise<GetProjectDto> {
    return this.projectService.findBySlugExternal(slug, phaseName, session);
  }
}

@UseInterceptors(ClassSerializerInterceptor)
@Controller("projects")
export class ProjectsController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard)
  @Get()
  async findBySlug(
    @GetUser() user: UserModel,
    @GetProject() project: ProjectModel,
    @GetProjectIsOwner() isOwner: boolean,
    @GetProjectIsController() isController: boolean
  ): Promise<GetProjectDto> {
    return this.projectService.findBySlugInternal(
      project,
      user,
      isOwner,
      isController
    );
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("all")
  async findAllByUser(@GetUser() user: UserModel): Promise<GetProjectDto[]> {
    return this.projectService.findAllByUser(user);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("all/controlled")
  async findAllControlledByUser(
    @GetUser() user: UserModel
  ): Promise<GetProjectDto[]> {
    return this.projectService.findAllControlledByUser(user);
  }

  @UseGuards(AuthGuard, UserGuard, TierGuard)
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: UserModel
  ): Promise<GetProjectDto> {
    console.log(createProjectDto);
    return this.projectService.create(createProjectDto, user);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, TierProjectGuard)
  @Patch()
  async edit(
    @Body() updateProjectDto: UpdateProjectDto,
    @GetProject() project: ProjectModel,
    @GetProjectIsController() isController: boolean,
    @GetUser() user: UserModel
  ): Promise<void> {
    return this.projectService.edit(
      updateProjectDto,
      project,
      isController,
      user
    );
  }

  @UseGuards(AuthGuard, UserGuard, ProjectOwnerGuard)
  @Delete()
  async delete(@GetProject() project: ProjectModel) {
    return this.projectService.delete(project);
  }
}
