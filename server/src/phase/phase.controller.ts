import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from "@nestjs/common";
import {
  Phase as PhaseModel,
  Project as ProjectModel,
  User as UserModel,
} from "@prisma/client";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { CreatePhaseDto } from "./dto/phase.create.dto";
import { GetPhase } from "./decorator/get-phase.decorator";
import { GetProject } from "../project/decorator/get-project.decorator";
import { GetUser } from "src/user/decorator/get-user.decorator";
import { PhaseGuard } from "./guard/phase.guard";
import { PhaseService } from "./phase.service";
import { ProjectGuard } from "../project/guard/project.guard";
import { ProjectControllerGuard } from "../project/guard/project-controller.guard";
import { UpdatePhaseDto } from "./dto/phase.update.dto";
import { UserGuard } from "src/user/guard/user.guard";
import { GetPhaseDto } from "./dto/get-phase.dto";
import { TierProjectGuard } from "src/user/guard/tier-project.guard";
import { GetPhasesQueryParamsDto } from "./dto/get-phases-query-params.dto";

@Controller("phases")
export class PhaseController {
  constructor(private phaseService: PhaseService) {}

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, TierProjectGuard)
  @Post()
  async create(
    @Body() createPhaseDto: CreatePhaseDto,
    @GetProject() project: ProjectModel
  ): Promise<GetPhaseDto> {
    return this.phaseService.create(createPhaseDto, project.id);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Patch("stop")
  async stopRegistration(@GetPhase() phase: PhaseModel): Promise<boolean> {
    return this.phaseService.stopRegistration(phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Patch("start")
  async startRegistration(@GetPhase() phase: PhaseModel): Promise<boolean> {
    return this.phaseService.startRegistration(phase);
  }

  @UseGuards(
    AuthGuard,
    UserGuard,
    ProjectControllerGuard,
    PhaseGuard,
    TierProjectGuard
  )
  @Patch()
  async edit(
    @Body() updatePhaseDto: UpdatePhaseDto,
    @GetPhase() phase: PhaseModel
  ): Promise<void> {
    return this.phaseService.edit(updatePhaseDto, phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Post("duplicate")
  async duplicate(@GetPhase() phase: PhaseModel): Promise<void> {
    return this.phaseService.duplicate(phase.id);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Delete()
  async delete(@GetPhase() phase: PhaseModel): Promise<void> {
    return await this.phaseService.delete(phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard)
  @Get("all")
  async findAllByProjectId(
    @GetProject() project: ProjectModel,
    @GetUser() user: UserModel
  ): Promise<GetPhaseDto[]> {
    return await this.phaseService.findAllByProjectId({
      project,
      userId: user.id,
    });
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard, PhaseGuard)
  @Get()
  async findOneByOuterId(
    @GetProject() project: ProjectModel,
    @GetPhase() phase: PhaseModel,
    @GetUser() user: UserModel
  ): Promise<GetPhaseDto> {
    return this.phaseService.findOneById(project, phase.id, user);
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("registrations")
  async findAllRegistrations(
    @GetUser() user: UserModel
  ): Promise<GetPhaseDto[]> {
    return this.phaseService.findAllRegistrations(user);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Patch("winners")
  async drawWinners(@GetPhase() phase: PhaseModel): Promise<void> {
    return this.phaseService.drawWinners(phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Get("winners/file")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", `attachment; filename="winners.csv"`)
  async downloadWinners(@GetPhase() phase: PhaseModel) {
    return this.phaseService.downloadWinners(phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Get("participants/file")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", `attachment; filename="participants.csv"`)
  async downloadParticipants(@GetPhase() phase: PhaseModel) {
    return this.phaseService.downloadParticipants(phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard, PhaseGuard)
  @Post("collector/favorite")
  async addCollectorFavorite(
    @GetUser() user: UserModel,
    @GetPhase() phase: PhaseModel
  ): Promise<void> {
    return this.phaseService.addCollectorFavorite({ user, phase });
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard, PhaseGuard)
  @Delete("collector/favorite")
  async deleteCollectorFavorite(
    @GetUser() user: UserModel,
    @GetPhase() phase: PhaseModel
  ): Promise<void> {
    return this.phaseService.deleteCollectorFavorite({ user, phase });
  }

  @UseGuards(AuthGuard, UserGuard)
  @Get("favorite")
  async getAllFavorited(@GetUser() user: UserModel): Promise<GetPhaseDto[]> {
    return this.phaseService.getAllFavorited(user);
  }

  @Get("all/public")
  async getPhasesByQueryParams(
    @Session() session: Record<"userId", number>,
    @Query() getPhasesQueryParamsDto: GetPhasesQueryParamsDto
  ) {
    return await this.phaseService.getPhasesByQueryParams({
      userId: session.userId,
      getPhasesQueryParamsDto,
    });
  }
}
