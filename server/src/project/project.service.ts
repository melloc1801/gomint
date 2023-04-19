import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { GetControllerDto, UpdateProjectDto } from "./dto/project.update.dto";
import { Project as ProjectModel, User as UserModel } from "@prisma/client";

import { CreateProjectDto } from "./dto/project.create.dto";
import { GetProjectDto } from "./dto/get-project.dto";
import { PROJECT_ERROR } from "./enum/project-error.enum";
import { PhaseService } from "src/phase/phase.service";
import { PrismaService } from "../prisma.service";
import { TIER_TYPES } from "src/user/user.constant";
import { ethers } from "ethers";
import map from "lodash/map";
import { plainToClass } from "class-transformer";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private phaseService: PhaseService
  ) {}

  async findBySlugExternal(
    slug: string,
    phaseName: string,
    session: Record<string, unknown>
  ): Promise<GetProjectDto> {
    if (!slug) {
      throw new BadRequestException();
    }

    const project = await this.prisma.project.findFirst({
      include: { controllers: true },
      where: { slug: { equals: slug, mode: "insensitive" } },
    });

    if (!project) {
      throw new NotFoundException(PROJECT_ERROR.PROJECT_NOT_FOUND);
    }

    const isOwner = project.userId === session?.userId;
    const isController = project.controllers.some((controller) => {
      return controller.userId === session?.userId;
    });

    const phases = await this.phaseService.findAllByProjectId({
      project,
      phaseName,
      userId: session?.userId as number,
    });

    const getProjectDto = plainToClass(GetProjectDto, {
      ...project,
      isOwner,
      isController,
      phases: !project.phasesPublished && !phaseName ? [] : phases,
    });

    return getProjectDto;
  }

  async findBySlugInternal(
    project: ProjectModel,
    user: UserModel,
    isOwner: boolean,
    isController: boolean
  ): Promise<GetProjectDto> {
    const phases = await this.phaseService.findAllByProjectId({
      project,
      userId: user.id,
    });
    const controllers = await this.getControllersByProjectId(project, user.id);

    const projectWithOwner = await this.prisma.project.findFirst({
      include: { user: { include: { tier: true } } },
      where: { id: project.id },
    });
    const premium = projectWithOwner.user.tier.type === TIER_TYPES.PREMIUM;

    const getProjectDto = plainToClass(GetProjectDto, {
      ...project,
      phases,
      isOwner,
      premium,
      controllers,
      isController,
    });

    return getProjectDto;
  }

  async checkSlugValidation(slug: string): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: { slug: { equals: slug, mode: "insensitive" } },
    });

    if (!project) return;
    throw new BadRequestException(PROJECT_ERROR.PROJECT_SLUG_IS_TAKEN);
  }

  async checkNameValidation(name: string): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (!project) return;
    throw new BadRequestException(PROJECT_ERROR.PROJECT_NAME_IS_TAKEN);
  }

  async checkEditNameValidation(
    name: string,
    project: ProjectModel
  ): Promise<void> {
    if (project.name.toUpperCase() === name.toUpperCase()) return;

    const foundProject = await this.prisma.project.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (!foundProject) return;
    throw new BadRequestException(PROJECT_ERROR.PROJECT_NAME_IS_TAKEN);
  }

  async checkEditSlugValidation(
    slug: string,
    project: ProjectModel
  ): Promise<void> {
    if (project.slug.toUpperCase() === slug.toUpperCase()) return;

    const foundSlug = await this.prisma.project.findFirst({
      where: { slug: { equals: slug, mode: "insensitive" } },
    });

    if (!foundSlug) return;
    throw new BadRequestException(PROJECT_ERROR.PROJECT_SLUG_IS_TAKEN);
  }

  async create(
    createProjectDto: CreateProjectDto,
    user: UserModel
  ): Promise<GetProjectDto> {
    const { controllers, ...newCreateProjectDto } = createProjectDto;

    await this.checkNameValidation(createProjectDto.name);
    await this.checkSlugValidation(createProjectDto.slug);

    if (!user.active) {
      throw new UnauthorizedException(PROJECT_ERROR.USER_INACTIVE);
    }

    if (controllers) {
      try {
        controllers.forEach((controller) => ({
          ...controller,
          address: ethers.utils.getAddress(controller.address),
        }));
      } catch (e) {
        throw new BadRequestException(PROJECT_ERROR.INVALID_CONTROLLER_ADDRESS);
      }

      const hasOwnAddress = controllers.some((controller) => {
        return user.address === ethers.utils.getAddress(controller.address);
      });
      if (hasOwnAddress) {
        throw new BadRequestException(
          PROJECT_ERROR.USING_OWN_ADDRESS_FOR_CONTROLLER
        );
      }
    }

    const project = await this.prisma.project
      .create({
        data: {
          ...newCreateProjectDto,
          user: {
            connect: { id: user.id },
          },
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException();
      });

    const controllerUsers = await Promise.all(
      map(controllers, async (controller) => {
        const user = await this.prisma.user.findFirst({
          where: { address: controller.address },
        });

        const freeTier = await this.prisma.tier.findFirst({
          where: { type: TIER_TYPES.FREE },
        });

        if (!user) {
          return await this.prisma.user.create({
            data: {
              ...controller,
              nonce: uuidv4(),
              tier: { connect: { id: freeTier.id } },
            },
          });
        }

        return user;
      })
    );

    await this.prisma.controller.createMany({
      data: map(controllerUsers, (controllerUser) => ({
        projectId: project.id,
        userId: controllerUser.id,
      })),
    });

    const getControllerDtos: GetControllerDto[] =
      await this.getControllersByProjectId(project, user.id);

    const isOwner = project.userId === user.id;
    const getProjectDto = plainToClass(GetProjectDto, {
      ...project,
      isOwner,
      controllers: getControllerDtos,
    });

    return getProjectDto;
  }

  async edit(
    updateProjectDto: UpdateProjectDto,
    project: ProjectModel,
    isController: boolean,
    user: UserModel
  ) {
    const { controllers, ...updateProjectDtoNew } = updateProjectDto;

    if (updateProjectDto.name)
      await this.checkEditNameValidation(updateProjectDto.name, project);

    if (updateProjectDto.slug)
      await this.checkEditSlugValidation(updateProjectDto.slug, project);

    if (controllers) {
      if (isController) {
        throw new BadRequestException(
          PROJECT_ERROR.CONTROLLER_ATTEMPT_CHANGE_CONTROLLERS
        );
      }

      try {
        controllers.forEach((controller) => ({
          ...controller,
          address: ethers.utils.getAddress(controller.address),
        }));
      } catch (error) {
        throw new BadRequestException(PROJECT_ERROR.INVALID_CONTROLLER_ADDRESS);
      }

      const hasOwnAddress = controllers.some((controller) => {
        return user.address === ethers.utils.getAddress(controller.address);
      });

      if (hasOwnAddress) {
        throw new BadRequestException(
          PROJECT_ERROR.USING_OWN_ADDRESS_FOR_CONTROLLER
        );
      }

      const freeTier = await this.prisma.tier.findFirst({
        where: { type: TIER_TYPES.FREE },
      });
      const controllerUsers = await Promise.all(
        map(controllers, async (controller) => {
          const user = await this.prisma.user.findFirst({
            where: { address: controller.address },
          });

          if (!user) {
            return await this.prisma.user.create({
              data: {
                ...controller,
                nonce: uuidv4(),
                tier: { connect: { id: freeTier.id } },
              },
            });
          }

          return user;
        })
      );

      await this.prisma.controller.deleteMany({
        where: {
          projectId: project.id,
        },
      });
      await this.prisma.controller.createMany({
        data: map(controllerUsers, (controllerUser) => ({
          projectId: project.id,
          userId: controllerUser.id,
        })),
      });
    }

    await this.prisma.project
      .update({
        where: { id: project.id },
        data: {
          ...updateProjectDtoNew,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException();
      });
  }

  async findAllByUser(user: UserModel): Promise<GetProjectDto[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: user.id },
    });

    const dtos = await Promise.all(
      projects.map(async (project) => {
        const phases = await this.phaseService.findAllByProjectId({
          project,
          userId: user.id,
        });

        const controllers = await this.getControllersByProjectId(
          project,
          user.id
        );

        const getProjectDto = plainToClass(GetProjectDto, {
          ...project,
          isOwner: true,
          phases: phases,
          controllers,
        });

        return getProjectDto;
      })
    );

    return dtos;
  }

  async findAllControlledByUser(user: UserModel): Promise<GetProjectDto[]> {
    const controllers = await this.prisma.controller.findMany({
      where: { userId: user.id },
    });
    const projectIds = controllers.map((controller) => controller.projectId);

    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      where: { id: { in: projectIds } },
    });

    const dtos = await Promise.all(
      projects.map(async (project) => {
        const phases = await this.phaseService.findAllByProjectId({
          project,
          userId: user.id,
        });

        const controllers = await this.getControllersByProjectId(
          project,
          user.id
        );

        const getProjectDto = plainToClass(GetProjectDto, {
          ...project,
          isOwner: false,
          isController: true,
          phases: phases,
          controllers,
        });

        return getProjectDto;
      })
    );

    return dtos;
  }

  async delete(project: ProjectModel) {
    return this.prisma.project.delete({ where: { id: project.id } });
  }

  async getControllersByProjectId(
    project: ProjectModel,
    userId: number
  ): Promise<GetControllerDto[]> {
    const isOwner = project.userId === userId;

    const controllers = await this.prisma.controller.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      where: { projectId: project.id },
    });

    return isOwner
      ? controllers.map((controller) => {
          return plainToClass(GetControllerDto, {
            ...controller,
            ...controller.user,
          });
        })
      : [];
  }
}
