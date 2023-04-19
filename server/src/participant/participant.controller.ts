import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "src/auth/guard/auth.guard";
import { GetPhase } from "src/phase/decorator/get-phase.decorator";
import { GetUser } from "src/user/decorator/get-user.decorator";
import { ParticipantService } from "./participant.service";
import { PhaseGuard } from "src/phase/guard/phase.guard";
import { ProjectGuard } from "../project/guard/project.guard";
import { UserGuard } from "src/user/guard/user.guard";
import { Phase as PhaseModel, User as UserModel } from "@prisma/client";
import { CreateParticipantsManuallyDto } from "./dto/createParicipantsManually.dto";
import { GetAllQueryParamsDto } from "./dto/getAllQueryParams.dto";
import { UpdateParticipantDto } from "./dto/updateParticipant.dto";
import { PARTICIPANT_QUERY_PARAMS } from "./participant.constant";
import { ProjectControllerGuard } from "src/project/guard/project-controller.guard";
import { CreateParticipantDto } from "./dto/create-participant.dto";

@Controller("participants")
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @UseGuards(AuthGuard, UserGuard, ProjectGuard, PhaseGuard)
  @Post()
  async create(
    @GetUser() user: UserModel,
    @GetPhase() phase: PhaseModel,
    @Body() createParticipantDto: CreateParticipantDto
  ): Promise<void> {
    return this.participantService.create({
      user,
      phaseId: phase.id,
      registrationAddress: createParticipantDto.registrationAddress,
    });
  }

  @Post("manually")
  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  async createManually(
    @Body() createParticipantsManuallyDto: CreateParticipantsManuallyDto,
    @GetPhase() phase: PhaseModel
  ) {
    return await this.participantService.createManually(
      phase,
      createParticipantsManuallyDto
    );
  }

  @Patch()
  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  async update(
    @Query(PARTICIPANT_QUERY_PARAMS.ADDRESS) address: string,
    @GetPhase() phase: PhaseModel,
    @Body() updateParticipantDto: UpdateParticipantDto
  ) {
    return this.participantService.update(phase, {
      participantAddress: address,
      updateParticipantDto,
    });
  }

  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  @Get()
  async findAllByPhaseId(
    @Query() query: GetAllQueryParamsDto,
    @GetPhase() phase: PhaseModel
  ) {
    return await this.participantService.findAllByPhaseId(phase, query);
  }

  @Delete("manually")
  @UseGuards(AuthGuard, UserGuard, ProjectControllerGuard, PhaseGuard)
  async delete(
    @Query(PARTICIPANT_QUERY_PARAMS.ADDRESS) address: string,
    @GetPhase() phase: PhaseModel
  ) {
    return this.participantService.delete(phase, address);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard, PhaseGuard)
  @Get("status")
  async registrationStatus(
    @GetPhase() phase: PhaseModel,
    @GetUser() user: UserModel
  ): Promise<boolean> {
    return this.participantService.getRegistrationStatus(user, phase);
  }

  @UseGuards(AuthGuard, UserGuard, ProjectGuard, PhaseGuard)
  @Delete()
  async registrationCancellation(
    @GetPhase() phase: PhaseModel,
    @GetUser() user: UserModel
  ): Promise<void> {
    return this.participantService.cancelRegistration(user, phase);
  }
}
