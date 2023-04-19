import { BadRequestException, Injectable } from "@nestjs/common";
import {
  GetPhasesQueryParamsDto,
  SortBy,
} from "./dto/get-phases-query-params.dto";
import {
  Phase as PhaseModel,
  Project as ProjectModel,
  User as UserModel,
} from "@prisma/client";
import { map, sampleSize } from "lodash";
import { plainToClass, plainToInstance } from "class-transformer";

import { CreatePhaseDto } from "./dto/phase.create.dto";
import { GetPhaseDto } from "./dto/get-phase.dto";
import { PHASE_ERROR } from "./enum/phase-error.enum";
import { PHASE_TYPE } from "./enum/phase.enum";
import { PrismaService } from "../prisma.service";
import { UpdatePhaseDto } from "./dto/phase.update.dto";
import { createObjectCsvStringifier } from "csv-writer";

const csv = createObjectCsvStringifier({
  header: [
    { id: "createdAt", title: "Registration" },
    { id: "address", title: "Address" },
    { id: "discordName", title: "Discord" },
    { id: "twitterName", title: "Twitter" },
    { id: "mints", title: "Mints" },
    { id: "winner", title: "Winner" },
  ],
});

const headerString = csv.getHeaderString();

@Injectable()
export class PhaseService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPhaseDto: CreatePhaseDto,
    projectId: number
  ): Promise<GetPhaseDto> {
    const { minEth, registrationEnd, registrationStart } = createPhaseDto;

    const phaseNameUsed = await this.prisma.phase.count({
      where: { name: createPhaseDto.name, projectId },
    });

    if (phaseNameUsed) {
      throw new BadRequestException(PHASE_ERROR.PHASE_NAME_USED);
    }

    const projectPhases = await this.prisma.phase.findMany({
      where: { projectId },
      orderBy: { outerId: "desc" },
    });

    const outerId = projectPhases[0] ? projectPhases[0].outerId + 1 : 0;

    if (registrationStart && registrationEnd) {
      if (registrationStart >= registrationEnd) {
        createPhaseDto.registrationEnd = null;
      }
    }

    if (!registrationStart && registrationEnd) {
      createPhaseDto.registrationEnd = null;
    }

    if (minEth && minEth < 1e-18) {
      throw new BadRequestException(PHASE_ERROR.MIN_PRICE_IN_WEI_LESS_THAN_1);
    }

    if (
      createPhaseDto.discordServers?.length >
      Number(process.env.DISCORD_SERVERS_LIMIT_PER_PROJECT)
    ) {
      throw new BadRequestException("Can't have more then two discord servers");
    }

    const phase = await this.prisma.phase
      .create({
        data: {
          outerId,
          ...createPhaseDto,
          project: {
            connect: { id: projectId },
          },
          twitterAccounts: {
            create: createPhaseDto.twitterAccounts,
          },
          tweets: {
            create: createPhaseDto.tweets?.map((tweet) => ({
              like: tweet.like ? tweet.like : false,
              retweet: tweet.retweet ? tweet.retweet : false,
              ...tweet,
            })),
          },
          collections: {
            create: createPhaseDto.collections,
          },
          discordServers: {
            create: createPhaseDto.discordServers?.map((discordServer) => ({
              ...discordServer,
              discordRoles: {
                create: discordServer.discordRoles,
              },
            })),
          },
        },
        include: {
          collections: true,
          twitterAccounts: true,
          discordServers: {
            include: {
              discordRoles: true,
            },
          },
        },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException();
      });

    return plainToClass(GetPhaseDto, {
      ...phase,
      winnersCount: null,
      participantsCount: null,
    });
  }

  async delete(phase: PhaseModel) {
    await this.prisma.phase.delete({ where: { id: phase.id } });
  }

  async edit(updatePhaseDto: UpdatePhaseDto, phase: PhaseModel) {
    const { registrationStart, registrationEnd, minEth } = updatePhaseDto;

    if (updatePhaseDto.name) {
      const phaseNameUsed = await this.prisma.phase.findFirst({
        where: {
          name: updatePhaseDto.name,
          projectId: phase.projectId,
          NOT: {
            id: phase.id,
          },
        },
      });

      if (phaseNameUsed) {
        throw new BadRequestException(PHASE_ERROR.PHASE_NAME_USED);
      }
    }

    if (registrationStart && registrationEnd) {
      if (registrationStart >= registrationEnd) {
        updatePhaseDto.registrationEnd = null;
      }
    }

    if (!(registrationStart || phase.registrationStart) && registrationEnd) {
      updatePhaseDto.registrationEnd = null;
    }

    if (minEth && minEth < 1e-18) {
      throw new BadRequestException(PHASE_ERROR.MIN_PRICE_IN_WEI_LESS_THAN_1);
    }

    updatePhaseDto.collections &&
      (await this.prisma.collection.deleteMany({
        where: { phaseId: phase.id },
      }));
    updatePhaseDto.twitterAccounts &&
      (await this.prisma.twitterAccount.deleteMany({
        where: { phaseId: phase.id },
      }));
    updatePhaseDto.tweets &&
      (await this.prisma.tweet.deleteMany({
        where: { phaseId: phase.id },
      }));
    updatePhaseDto.discordServers &&
      (await this.prisma.discordServer.deleteMany({
        where: { phaseId: phase.id },
      }));

    await this.prisma.phase
      .update({
        where: { id: phase.id },
        data: {
          ...updatePhaseDto,
          collections: {
            create: updatePhaseDto.collections,
          },
          tweets: {
            create: updatePhaseDto.tweets?.map((tweet) => ({
              like: tweet.like ? tweet.like : false,
              retweet: tweet.retweet ? tweet.retweet : false,
              ...tweet,
            })),
          },
          twitterAccounts: {
            create: updatePhaseDto.twitterAccounts,
          },
          discordServers: {
            create: updatePhaseDto.discordServers?.map((discordServer) => ({
              ...discordServer,
              discordRoles: {
                create: discordServer.discordRoles,
              },
            })),
          },
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException();
      });
  }

  async duplicate(phaseId: number) {
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId },
      include: {
        tweets: {
          select: {
            like: true,
            retweet: true,
            tagAmount: true,
            link: true,
          },
        },
        collections: {
          select: {
            collectionAddress: true,
            collectionLink: true,
            collectionName: true,
            amount: true,
          },
        },
        twitterAccounts: {
          select: {
            account: true,
          },
        },
        discordServers: {
          select: {
            discordServerId: true,
            discordServerName: true,
            discordServerLink: true,
            discordRolesUseType: true,
            discordRoles: {
              select: {
                roleName: true,
                roleId: true,
              },
            },
          },
        },
      },
    });

    const projectPhases = await this.prisma.phase.findMany({
      where: { projectId: phase.projectId },
      orderBy: { outerId: "desc" },
    });

    const outerId = projectPhases[0] ? projectPhases[0].outerId + 1 : 0;

    await this.prisma.phase
      .create({
        data: {
          ...phase,
          outerId,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          winnersFilePath: null,
          registrationEnd: null,
          registrationStart: null,
          name: `access-list-${outerId}`,
          tweets: {
            create: phase.tweets,
          },
          collections: {
            create: phase.collections,
          },
          twitterAccounts: {
            create: phase.twitterAccounts,
          },
          discordServers: {
            create: phase.discordServers?.map((discordServer) => ({
              ...discordServer,
              discordRoles: {
                create: discordServer.discordRoles,
              },
            })),
          },
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException();
      });
  }

  async findAllByProjectId(props: {
    project: ProjectModel;
    userId: number;
    phaseName?: string;
  }): Promise<GetPhaseDto[]> {
    const { project, userId, phaseName } = props;

    const projectWithDeps = await this.prisma.project.findFirst({
      include: { user: true, controllers: true },
      where: {
        id: project.id,
      },
    });
    const isProjectOwner = projectWithDeps.user.id === userId;
    const isController = projectWithDeps.controllers.some((controller) => {
      return controller.userId === userId;
    });

    const phases = await this.prisma.phase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        twitterAccounts: true,
        collections: true,
        tweets: true,
        discordServers: {
          include: {
            discordRoles: true,
          },
        },
      },
      where: {
        projectId: project.id,
        name: phaseName ? phaseName : undefined,
      },
    });

    return Promise.all(
      map(phases, async (phase) => {
        const winnersCount = await this.prisma.participant.count({
          where: { phaseId: phase.id, winner: true },
        });

        const participantsCount =
          isProjectOwner || isController
            ? await this.prisma.participant.count({
                where: { phaseId: phase.id },
              })
            : null;

        const favorite = await this.prisma.collectorFavoritePhase.count({
          where: { phaseId: phase.id, userId },
        });

        return plainToClass(GetPhaseDto, {
          ...phase,
          winnersCount,
          participantsCount,
          favorite: Boolean(favorite),
        });
      })
    );
  }

  async findAllRegistrations(user: UserModel) {
    const participants = await this.prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        phase: {
          include: {
            project: true,
            twitterAccounts: true,
            discordServers: true,
            collections: true,
            tweets: true,
          },
        },
      },
      where: { userId: user.id },
    });

    return await Promise.all(
      map(participants, async (participant) => {
        const participantsCount =
          participant.phase.project.userId === user.id
            ? await this.prisma.participant.count({
                where: { phaseId: participant.phase.id },
              })
            : null;

        const winnersCount = await this.prisma.participant.count({
          where: { phaseId: participant.phase.id, winner: true },
        });

        const favorite = await this.prisma.collectorFavoritePhase.count({
          where: { phaseId: participant.phase.id, userId: user.id },
        });

        return plainToClass(GetPhaseDto, {
          ...participant.phase,
          winnersCount,
          participantsCount,
          winner: participant.winner,
          favorite: Boolean(favorite),
        });
      })
    );
  }

  async stopRegistration(phase: PhaseModel) {
    const currentTime = new Date();
    const { registrationStart, registrationEnd } = phase;

    if (currentTime < registrationEnd || !registrationEnd) {
      if (registrationStart && currentTime > registrationStart) {
        await this.prisma.phase.update({
          where: { id: phase.id },
          data: { registrationEnd: currentTime },
        });
        return true;
      }
    }
    return false;
  }

  async startRegistration(phase: PhaseModel) {
    const currentTime = new Date();
    const { registrationStart } = phase;

    if (!registrationStart) {
      await this.prisma.phase.update({
        where: { id: phase.id },
        data: { registrationStart: currentTime },
      });
      return true;
    }
    return false;
  }

  async drawWinners(phase: PhaseModel): Promise<void> {
    const { id, type, registrationEnd, numberOfWinners } = phase;
    const registrationClosed = registrationEnd && registrationEnd < new Date();
    if (!registrationClosed) {
      throw new BadRequestException(PHASE_ERROR.DRAW_WHILE_REGISTRATION_OPENED);
    }

    const participants = await this.prisma.participant.findMany({
      include: { user: true },
      where: {
        phaseId: id,
      },
    });

    if (type === PHASE_TYPE.RAFFLE) {
      await Promise.all(
        participants
          .filter((participant) => participant.winner)
          .map(async (winner) =>
            this.prisma.participant.update({
              where: {
                phaseId_userId: {
                  phaseId: winner.phaseId,
                  userId: winner.userId,
                },
              },
              data: { winner: false },
            })
          )
      );

      const winnerParticipants = sampleSize(participants, numberOfWinners);

      await Promise.all(
        winnerParticipants.map(
          async (participant) =>
            await this.prisma.participant.update({
              where: {
                phaseId_userId: {
                  phaseId: participant.phaseId,
                  userId: participant.userId,
                },
              },
              data: { winner: true },
            })
        )
      );
    }

    if (type === PHASE_TYPE.LIMIT) {
      await Promise.all(
        participants.map(
          async (participant) =>
            await this.prisma.participant.update({
              where: {
                phaseId_userId: {
                  phaseId: participant.phaseId,
                  userId: participant.userId,
                },
              },
              data: { winner: true },
            })
        )
      );
    }
  }

  async findOneById(project: ProjectModel, phaseId: number, user: UserModel) {
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId },
      include: {
        tweets: true,
        project: true,
        collections: true,
        twitterAccounts: true,
        discordServers: {
          include: {
            discordRoles: true,
          },
        },
      },
    });

    const projectWithDeps = await this.prisma.project.findFirst({
      include: { user: true, controllers: true },
      where: {
        id: project.id,
      },
    });
    const isProjectOwner = projectWithDeps.user.id === user.id;
    const isController = projectWithDeps.controllers.some((controller) => {
      return controller.userId === user.id;
    });

    const participantsCount =
      isProjectOwner || isController
        ? await this.prisma.participant.count({
            where: { phaseId: phase.id },
          })
        : null;

    const winnersCount = await this.prisma.participant.count({
      where: { phaseId: phase.id, winner: true },
    });

    const favorite = await this.prisma.collectorFavoritePhase.count({
      where: { phaseId: phase.id, userId: user.id },
    });

    return plainToClass(GetPhaseDto, {
      ...phase,
      winnersCount,
      participantsCount,
      favorite: Boolean(favorite),
    });
  }

  async downloadWinners(phase: PhaseModel) {
    const winners = await this.prisma.participant.findMany({
      include: { user: true },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        winner: true,
        phaseId: phase.id,
      },
    });

    const winnersString = csv.stringifyRecords(
      winners.map((participant) => ({
        ...participant.user,
        winner: participant.winner,
        mints: phase.mintsPerWinner,
        discordName: participant.user.discordUserName,
        twitterName: participant.user.twitterUserName,
        createdAt: new Date(participant.createdAt).toISOString(),
      }))
    );

    return headerString + winnersString;
  }

  async downloadParticipants(phase: PhaseModel) {
    const participants = await this.prisma.participant.findMany({
      include: { user: true },
      orderBy: {
        winner: "desc",
      },
      where: {
        phaseId: phase.id,
      },
    });

    const participantsString = csv.stringifyRecords(
      participants.map((participant) => ({
        ...participant.user,
        mints: phase.mintsPerWinner,
        winner: participant.winner || "",
        discordName: participant.user.discordUserName,
        twitterName: participant.user.twitterUserName,
        createdAt: new Date(participant.createdAt).toISOString(),
      }))
    );

    return headerString + participantsString;
  }

  async addCollectorFavorite({
    user,
    phase,
  }: {
    user: UserModel;
    phase: PhaseModel;
  }): Promise<void> {
    const favorite = await this.prisma.collectorFavoritePhase.findFirst({
      where: { phaseId: phase.id, userId: user.id },
    });

    if (favorite) {
      throw new BadRequestException(PHASE_ERROR.PHASE_ALREADY_FAVORITED);
    }

    await this.prisma.collectorFavoritePhase
      .create({
        data: {
          user: {
            connect: { id: user.id },
          },
          phase: {
            connect: { id: phase.id },
          },
        },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException();
      });
  }

  async deleteCollectorFavorite({
    user,
    phase,
  }: {
    user: UserModel;
    phase: PhaseModel;
  }): Promise<void> {
    const collectorFavoritePhase =
      await this.prisma.collectorFavoritePhase.findFirst({
        where: { phaseId: phase.id, userId: user.id },
      });

    if (!collectorFavoritePhase) {
      throw new BadRequestException(PHASE_ERROR.PHASE_NOT_FAVORITED);
    }

    await this.prisma.collectorFavoritePhase
      .delete({
        where: { userId_phaseId: { phaseId: phase.id, userId: user.id } },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException();
      });
  }

  async getAllFavorited(user: UserModel): Promise<GetPhaseDto[]> {
    const allFavoritedPhases = await this.prisma.phase.findMany({
      include: { collectorFavorites: true, project: true },
      where: {
        collectorFavorites: { some: { userId: user.id } },
      },
    });

    return allFavoritedPhases.map((phase) =>
      plainToClass(GetPhaseDto, {
        ...phase,
        favorite: true,
      })
    );
  }

  async getPhasesByQueryParams({
    getPhasesQueryParamsDto,
    userId,
  }: {
    getPhasesQueryParamsDto: GetPhasesQueryParamsDto;
    userId: number;
  }) {
    const {
      sort,
      page = 1,
      limit = 10,
      searchText,
      includeEnded,
      order = "desc",
    } = getPhasesQueryParamsDto;

    const searchTextProcessed = searchText?.replace(/[\s\n\t]/g, "_");
    const registrationDataClause =
      includeEnded === "true"
        ? [
            {
              registrationEnd: undefined,
            },
          ]
        : [
            {
              registrationEnd: { gt: new Date() },
            },
            {
              registrationEnd: null,
            },
          ];

    const allPhases = await this.prisma.phase.findMany({
      include: {
        project: true,
        participants: true,
        collectorFavorites: true,
      },
      where: {
        OR: [
          {
            OR: registrationDataClause,
            name: { contains: searchTextProcessed, mode: "insensitive" },
          },
          {
            OR: registrationDataClause,
            project: {
              name: { contains: searchTextProcessed, mode: "insensitive" },
            },
          },
        ],
      },
    });

    const limitedPhases = await this.prisma.phase.findMany({
      take: limit,
      skip: limit * (page - 1),
      include: {
        project: true,
      },
      where: {
        id: { in: allPhases.map((phase) => phase.id) },
      },
      orderBy: {
        createdAt: sort === SortBy.createdAt ? order : undefined,
        registrationEnd:
          sort === SortBy.registrationEnd
            ? {
                sort: order,
                nulls: "last",
              }
            : undefined,
        participants:
          sort === SortBy.participants ? { _count: order } : undefined,
      },
    });

    const totalPagesCount = Math.ceil(allPhases.length / limit);

    const nextPage = page + 1;
    const phasesDto = await Promise.all(
      limitedPhases.map(async (phase) => {
        const favoriteCount = await this.prisma.collectorFavoritePhase.count({
          where: { phaseId: phase.id },
        });

        const favorite = userId
          ? await this.prisma.collectorFavoritePhase.count({
              where: { phaseId: phase.id, userId },
            })
          : false;

        return plainToInstance(GetPhaseDto, {
          ...phase,
          favoriteCount,
          favorite: Boolean(favorite),
        });
      })
    );

    return {
      phases: phasesDto,
      totalCount: allPhases.length,
      nextCursor: nextPage > totalPagesCount ? null : nextPage,
    };
  }
}
