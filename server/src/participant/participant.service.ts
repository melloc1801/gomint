import { BadRequestException, Injectable } from "@nestjs/common";
import {
  COMPOUND_REQUIREMENT_USE_TYPE,
  DiscordRole,
  DiscordServer,
  Phase as PhaseModel,
  User as UserModel,
} from "@prisma/client";
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_ORDER,
  PAGINATION_DEFAULT_SORTING_COLUMN,
} from "./participant.constant";
import { getBalance, getNfts } from "../../utils/alchemy";
import { lastValueFrom, map, Observable } from "rxjs";

import { CreateParticipantsManuallyDto } from "../participant/dto/createParicipantsManually.dto";
import { GetParticipantDto } from "./dto/getParticipant.dto";
import { HttpService } from "@nestjs/axios";
import { PARTICIPANT_ERROR } from "./enum/participant-error.enum";
import { PHASE_ERROR } from "src/phase/enum/phase-error.enum";
import { PHASE_TYPE } from "src/phase/enum/phase.enum";
import { PaginationParams } from "./type/paginationParams.type";
import { PaginationSortingColumnEnum } from "./enum/paginationOrder.enum";
import { PrismaService } from "../prisma.service";
import Twitter from "twitter-lite";
import { UpdateParticipantArgs } from "./type/updateParticipantArgs.type";
import { UserService } from "src/user/user.service";
import { ethers } from "ethers";
import { plainToClass } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import { API_ERROR } from "src/app.constant";
import { logtail } from "src/main";
import axios, { AxiosResponse, AxiosError } from "axios";

@Injectable()
export class ParticipantService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private httpService: HttpService
  ) {}

  async create({
    user,
    phaseId,
    registrationAddress,
  }: {
    user: UserModel;
    phaseId: number;
    registrationAddress: string;
  }) {
    const registrationWallet = await this.prisma.wallet.findFirst({
      where: { address: registrationAddress, userId: user.id },
    });

    const userWallets = await this.prisma.wallet.findMany({
      where: { userId: user.id },
    });

    const userAddresses = [
      user.address,
      ...userWallets.map((wallet) => wallet.address),
    ];

    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId },
      include: {
        collections: true,
        twitterAccounts: true,
        tweets: true,
        discordServers: {
          include: {
            discordRoles: true,
          },
        },
      },
    });

    const participant = await this.prisma.participant.findFirst({
      where: {
        userId: user.id,
        phaseId: phase.id,
      },
    });

    if (participant) {
      throw new BadRequestException(PARTICIPANT_ERROR.ALREADY_REGISTERED);
    }

    if (!phase.registrationStart) {
      throw new BadRequestException(PARTICIPANT_ERROR.NO_REGISTRATION);
    }

    if (phase.registrationStart > new Date()) {
      throw new BadRequestException(PARTICIPANT_ERROR.REGISTRATION_NOT_STARTED);
    }

    if (phase.registrationEnd && phase.registrationEnd < new Date()) {
      throw new BadRequestException(PARTICIPANT_ERROR.REGISTRATION_ENDED);
    }

    const participantsCount = await this.prisma.participant.count({
      where: { phaseId: phase.id },
    });

    const isFull =
      !(phase.type === PHASE_TYPE.RAFFLE) &&
      participantsCount >= phase.numberOfWinners;

    if (isFull) {
      throw new BadRequestException(PHASE_ERROR.NO_SPOTS_AVAILABLE);
    }

    if (phase.emailRequired && !user.email) {
      throw new BadRequestException(PARTICIPANT_ERROR.EMAIL_REQUIRED);
    }

    if (phase.minEth) {
      const minWei = phase.minEth * 10 ** 18;
      let accumulativeBalance = 0;
      const balanceRequests = await Promise.all(
        userAddresses.map(async (address) => {
          try {
            const balance = await getBalance(address);
            accumulativeBalance += parseInt(balance);
          } catch (error) {
            return error;
          }
        })
      );

      const errorRequests = balanceRequests.filter((e) => e);
      const minEthRequirementNotMet = accumulativeBalance < minWei;

      if (minEthRequirementNotMet) {
        if (errorRequests.length) {
          throw new BadRequestException(API_ERROR.SOMETHING_WENT_WRONG);
        }
        throw new BadRequestException(PARTICIPANT_ERROR.NOT_ENOUGH_BALANCE);
      }
    }

    if (phase.collections.length) {
      const allCollectionsRequired =
        phase.collectionsUseType === COMPOUND_REQUIREMENT_USE_TYPE.ALL;

      const collectionsRequirementsChecks = await Promise.all(
        phase.collections.map(async (collection) => {
          let accumulativeUserTokenNumber = 0;

          const collectionBalanceRequests = await Promise.all(
            userAddresses.map(async (address) => {
              try {
                const data = await getNfts({
                  owner: address,
                  withMetadata: false,
                  contractAddresses: [collection.collectionAddress],
                });
                accumulativeUserTokenNumber += data.totalCount;
              } catch (error) {
                return error;
              }
            })
          );

          const errorRequests = collectionBalanceRequests.filter((e) => e);

          if (accumulativeUserTokenNumber < collection.amount) {
            if (errorRequests.length) {
              return {
                collection,
                error: errorRequests[0],
                requirementMet: false,
              };
            }
            return {
              collection,
              error: null,
              requirementMet: false,
            };
          }

          return {
            collection,
            error: null,
            requirementMet: true,
          };
        })
      );

      const collectionRequirementsCheckWithErrors =
        collectionsRequirementsChecks.filter((c) => c.error);

      const unmetRequirementsCollectionNames = collectionsRequirementsChecks
        .filter((c) => !c.requirementMet)
        .map((c) => c.collection.collectionName);

      if (
        (allCollectionsRequired && unmetRequirementsCollectionNames.length) ||
        (!allCollectionsRequired &&
          unmetRequirementsCollectionNames.length === phase.collections.length)
      ) {
        if (collectionRequirementsCheckWithErrors.length) {
          await Promise.all(
            collectionRequirementsCheckWithErrors.map((check) => {
              logtail.error({
                ...check.error,
                userId: user.id,
                phaseId: phase.id,
                userAddress: user.address,
                projectId: phase.projectId,
              });
            })
          );

          throw new BadRequestException(API_ERROR.SOMETHING_WENT_WRONG);
        } else {
          throw new BadRequestException(
            `You have insufficient NFT amount for ${unmetRequirementsCollectionNames}`
          );
        }
      }
    }

    const twitterClient = new Twitter({
      subdomain: "api",
      version: "1.1",
      consumer_key: process.env.TWITTER_CLIENT_ID,
      consumer_secret: process.env.TWITTER_CLIENT_SECRET,
      access_token_key: user.twitterAccessTokenKey,
      access_token_secret: user.twitterAccessTokenSecret,
    });

    if (phase.twitterAccounts.length) {
      if (!user.twitterAccessTokenKey || !user.twitterAccessTokenSecret)
        throw new BadRequestException(PARTICIPANT_ERROR.TWITTER_NOT_CONNECTED);

      const allTwitterAccountsRequired =
        phase.twitterAccountsUseType === COMPOUND_REQUIREMENT_USE_TYPE.ALL;

      const accountsRelationship = await Promise.all(
        phase.twitterAccounts.map(async (twitterAccount) => {
          const res = await twitterClient
            .get("friendships/show", {
              source_screen_name: user.twitterUserName,
              target_screen_name: twitterAccount.account,
            })
            .then((result) => {
              return { twitterAccount, result, error: null };
            })
            .catch((error) => {
              return { twitterAccount, result: null, error };
            });

          const following =
            !res.error && res.result.relationship.source.following;
          return { twitterAccount, following, error: res.error };
        })
      );

      const badRelationships = accountsRelationship.filter(
        (relationship) => !relationship.following
      );

      if (
        (allTwitterAccountsRequired && badRelationships.length) ||
        (!allTwitterAccountsRequired &&
          badRelationships.length === phase.twitterAccounts.length)
      ) {
        const errorRelationsips = badRelationships.filter(
          (relationship) => relationship.error
        );
        if (errorRelationsips.length) {
          await Promise.all(
            errorRelationsips.map((relationship) => {
              logtail.error({
                ...relationship.error,
                userId: user.id,
                phaseId: phase.id,
                userAddress: user.address,
                projectId: phase.projectId,
              });
            })
          );

          throw new BadRequestException(API_ERROR.SOMETHING_WENT_WRONG);
        } else {
          throw new BadRequestException(
            `You are not following on Twitter: ${badRelationships.map(
              (relationship) => `@${relationship.twitterAccount.account}`
            )}`
          );
        }
      }
    }

    if (phase.tweets.length) {
      if (!user.twitterAccessTokenKey || !user.twitterAccessTokenSecret)
        throw new BadRequestException(PARTICIPANT_ERROR.TWITTER_NOT_CONNECTED);

      const allTweetsRequired =
        phase.tweetsUseType === COMPOUND_REQUIREMENT_USE_TYPE.ALL;

      const tweetsStatusesReq = await Promise.all(
        phase.tweets.map(async (requiredTweet) => {
          const tweetId = requiredTweet.link.match(/(?<=status\/)(\d+)/g)[0];

          const tweetStatusRes = await twitterClient
            .get("statuses/show", {
              id: tweetId,
              trim_user: true,
              include_entities: true,
            })
            .then((result) => {
              return { result, error: null };
            })
            .catch((error) => {
              return { result: null, error };
            });

          if (tweetStatusRes.error) {
            return {
              requiredTweet,
              requirementMet: false,
              error: tweetStatusRes.error,
            };
          }

          const userTimelineTweetsRes = await twitterClient
            .get("statuses/user_timeline", {
              include_entities: true,
              trim_user: true,
            })
            .then((result) => {
              return { result, error: null };
            })
            .catch((error) => {
              return { result: null, error };
            });

          if (userTimelineTweetsRes.error) {
            return {
              requiredTweet,
              requirementMet: false,
              error: userTimelineTweetsRes.error,
            };
          }

          const tweetStatus = tweetStatusRes.result;
          const userTimelineTweets = userTimelineTweetsRes.result;

          const requiredTweetMentionIds =
            tweetStatusRes.result.entities.user_mentions.map((m) => m.id_str);
          const likeReqMet = requiredTweet.like ? tweetStatus.favorited : true;
          const retweetReqMet = requiredTweet.retweet
            ? tweetStatus.retweeted
            : true;

          const hasCorrectMention = requiredTweet.tagAmount
            ? userTimelineTweets.some((tweet) => {
                const isRequiredTweet =
                  tweet.in_reply_to_status_id_str === tweetId;
                if (!isRequiredTweet) return false;

                const userMentionIds = tweet.entities.user_mentions.map(
                  (m) => m.id_str
                );
                const uniqueMentions = userMentionIds.filter(
                  (id_str, index, self) =>
                    !requiredTweetMentionIds.includes(id_str) &&
                    id_str !== tweetStatus.user.id_str &&
                    self.indexOf(id_str) === index &&
                    id_str !== user.twitterUserId
                );

                return uniqueMentions.length < requiredTweet.tagAmount
                  ? false
                  : true;
              })
            : true;

          const requirementMet =
            likeReqMet && retweetReqMet && hasCorrectMention;

          return { requiredTweet, requirementMet, error: null };
        })
      );

      const failedStatusReqs = tweetsStatusesReq.filter((req) => req.error);
      const badStatusReqs = tweetsStatusesReq.filter(
        (req) => !req.requirementMet
      );

      if (
        (allTweetsRequired && badStatusReqs.length) ||
        (!allTweetsRequired && badStatusReqs.length === phase.tweets.length)
      ) {
        if (failedStatusReqs.length) {
          await Promise.all(
            failedStatusReqs.map((req) => {
              logtail.error({
                user,
                phase,
                ...req.error,
              });
            })
          );

          throw new BadRequestException(API_ERROR.SOMETHING_WENT_WRONG);
        } else {
          throw new BadRequestException("Tweets requirement not met");
        }
      }
    }

    if (phase.discordServers.length) {
      if (!user.discordAccessToken || !user.discordRefreshToken)
        throw new BadRequestException(PARTICIPANT_ERROR.DISCORD_NOT_CONNECTED);

      const userServers = await this.getUserDiscordServers(user);
      const userServersIds = userServers.map((s) => s.id);

      const [fulfilled, unfulfilled] = phase.discordServers.reduce(
        ([pass, fail], server) => {
          return userServersIds.includes(server.discordServerId)
            ? [[...pass, server], fail]
            : [pass, [...fail, server]];
        },
        [[], []]
      );

      const allRequired =
        phase.discordServersUseType === COMPOUND_REQUIREMENT_USE_TYPE.ALL;
      const discordServersMemberRequirementMet = allRequired
        ? fulfilled.length === phase.discordServers.length
        : fulfilled.length;

      if (!discordServersMemberRequirementMet) {
        throw new BadRequestException(
          `You are not member of ${unfulfilled.map(
            (s) => `${s.discordServerName} `
          )}`
        );
      }

      const firstDiscordRoleCheck = await this.checkDiscordRole(
        fulfilled[0],
        user
      );

      if (!firstDiscordRoleCheck.requirementMet && !fulfilled[1]) {
        throw new BadRequestException(
          this.getRolesRequirementForServerErrorText(
            fulfilled[0].discordServerName
          )
        );
      }

      if (
        !firstDiscordRoleCheck.requirementMet &&
        !allRequired &&
        fulfilled[1]
      ) {
        const secondDiscordRoleCheck = await this.checkDiscordRole(
          fulfilled[1],
          user
        );

        if (!secondDiscordRoleCheck.requirementMet) {
          if (secondDiscordRoleCheck.error.status === 429) {
            throw new BadRequestException(
              this.getTryAgainErrorText(
                String(Math.ceil(secondDiscordRoleCheck.error.data.retry_after))
              )
            );
          }
          throw new BadRequestException(
            this.getRolesRequirementForServerErrorText(
              fulfilled[1].discordServerName
            )
          );
        }
      }

      if (!firstDiscordRoleCheck.requirementMet && allRequired) {
        if (firstDiscordRoleCheck.error.status === 429) {
          throw new BadRequestException(
            this.getTryAgainErrorText(
              String(Math.ceil(firstDiscordRoleCheck.error.data.retry_after))
            )
          );
        }
        throw new BadRequestException(
          this.getRolesRequirementForServerErrorText(
            fulfilled[0].discordServerName
          )
        );
      }

      if (firstDiscordRoleCheck.requirementMet && allRequired) {
        if (fulfilled[1]) {
          const secondDiscordRoleCheck = await this.checkDiscordRole(
            fulfilled[1],
            user
          );
          if (!secondDiscordRoleCheck.requirementMet) {
            if (secondDiscordRoleCheck.error.status === 429) {
              throw new BadRequestException(
                this.getTryAgainErrorText(
                  String(
                    Math.ceil(secondDiscordRoleCheck.error.data.retry_after)
                  )
                )
              );
            }
            throw new BadRequestException(
              this.getRolesRequirementForServerErrorText(
                fulfilled[1].discordServerName
              )
            );
          }
        }
      }
    }

    await this.prisma.participant
      .create({
        data: {
          user: {
            connect: { id: user.id },
          },
          phase: {
            connect: { id: phase.id },
          },
          registrationAddress: registrationWallet
            ? registrationWallet.address
            : user.address,
        },
      })
      .catch(() => {
        throw new BadRequestException();
      });
  }

  async update(
    phase: PhaseModel,
    { participantAddress, updateParticipantDto }: UpdateParticipantArgs
  ) {
    let address;
    try {
      address = ethers.utils.getAddress(participantAddress);
    } catch (error) {
      throw new BadRequestException(
        PARTICIPANT_ERROR.INVALID_PARTICIPANT_ADDRESS
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { address },
    });
    if (!user) {
      throw new BadRequestException(PARTICIPANT_ERROR.PARTICIPANT_NOT_FOUND);
    }

    const participant = await this.prisma.participant.findFirst({
      where: { userId: user.id, phaseId: phase.id },
    });
    if (!participant) {
      throw new BadRequestException(PARTICIPANT_ERROR.PARTICIPANT_NOT_FOUND);
    }

    await this.prisma.participant.update({
      where: {
        phaseId_userId: { userId: participant.userId, phaseId: phase.id },
      },
      data: updateParticipantDto,
    });
  }

  async createManually(
    phase: PhaseModel,
    createParticipantsManuallyDto: CreateParticipantsManuallyDto
  ): Promise<CreateParticipantsManuallyDto> {
    const checksumAddresses = createParticipantsManuallyDto.addresses.map(
      (address) => ethers.utils.getAddress(address)
    );

    const invalidAddresses: CreateParticipantsManuallyDto = { addresses: [] };
    for await (const address of checksumAddresses) {
      let user = await this.prisma.user.findFirst({
        where: { address },
      });

      if (!user) {
        await this.userService.create({
          address,
          nonce: uuidv4(),
        });
        user = await this.prisma.user.findFirst({
          where: { address },
        });
      }

      const participant = await this.prisma.participant.findFirst({
        where: { userId: user.id, phaseId: phase.id },
      });

      if (participant) {
        invalidAddresses.addresses.push(address);
        continue;
      }

      await this.prisma.participant.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          phase: {
            connect: { id: phase.id },
          },
          registrationAddress: address,
        },
      });
    }

    return invalidAddresses;
  }

  async findAllByPhaseId(
    phase: PhaseModel,
    {
      limit = PAGINATION_DEFAULT_LIMIT,
      order = PAGINATION_DEFAULT_ORDER,
      page = 0,
      sortingColumn = PAGINATION_DEFAULT_SORTING_COLUMN,
    }: PaginationParams
  ) {
    const isOrderByUserTable =
      sortingColumn === PaginationSortingColumnEnum.address ||
      sortingColumn === PaginationSortingColumnEnum.discordUserName ||
      sortingColumn === PaginationSortingColumnEnum.twitterUserName;
    const participantsTotalCount = await this.prisma.participant.count({
      where: { phaseId: phase.id },
    });
    const totalPagesCount = Math.ceil(participantsTotalCount / limit);
    if (page > totalPagesCount) {
      page = totalPagesCount;
    }

    const participants = await this.prisma.participant.findMany({
      where: { phaseId: phase.id },
      skip: limit * page,
      take: limit,
      include: {
        user: {
          select: {
            address: true,
            twitterUserName: true,
            discordUserName: true,
          },
        },
      },
      orderBy: isOrderByUserTable
        ? {
            user: {
              [sortingColumn]: order,
            },
          }
        : {
            [sortingColumn]: order,
          },
    });

    const nextPage = page + 1;
    const participantsDtos = participants.map((participant) =>
      plainToClass(GetParticipantDto, {
        ...participant,
        ...participant.user,
      })
    );
    return {
      participants: participantsDtos,
      totalCount: participantsTotalCount,
      nextCursor: totalPagesCount > nextPage ? nextPage : null,
    };
  }

  async delete(phase: PhaseModel, participantAddress: string) {
    let address;
    try {
      address = ethers.utils.getAddress(participantAddress);
    } catch (error) {
      throw new BadRequestException(
        PARTICIPANT_ERROR.INVALID_PARTICIPANT_ADDRESS
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { address },
    });
    if (!user) {
      throw new BadRequestException(PARTICIPANT_ERROR.PARTICIPANT_NOT_FOUND);
    }

    const participant = await this.prisma.participant.findFirst({
      where: { userId: user.id },
    });
    if (!participant) {
      throw new BadRequestException(PARTICIPANT_ERROR.PARTICIPANT_NOT_FOUND);
    }

    await this.prisma.participant.delete({
      where: { phaseId_userId: { phaseId: phase.id, userId: user.id } },
    });
  }

  async refreshDiscordAccessToken(user: UserModel) {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: user.discordRefreshToken,
    });

    const access = await lastValueFrom(
      this.httpService
        .post(`${process.env.DISCORD_API}/oauth2/token`, params)
        .pipe(map((result) => result.data))
    ).catch(async (error) => {
      logtail.error(error?.data);
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          discordRefreshToken: null,
          discordAccessToken: null,
        },
      });
      throw new BadRequestException(
        PARTICIPANT_ERROR.DISCORD_AUTH_TOKEN_EXPIRED
      );
    });

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        discordRefreshToken: access.refresh_token,
        discordAccessToken: access.access_token,
      },
    });
  }

  async getRegistrationStatus(user: UserModel, phase: PhaseModel) {
    const participant = await this.prisma.participant.findFirst({
      where: {
        userId: user.id,
        phaseId: phase.id,
      },
    });

    return Boolean(participant);
  }

  async cancelRegistration(user: UserModel, phase: PhaseModel) {
    await this.prisma.participant.delete({
      where: {
        phaseId_userId: {
          phaseId: phase.id,
          userId: user.id,
        },
      },
    });
  }

  discordRequestWrapper = async (
    observable: (headers) => Observable<AxiosResponse | AxiosError>,
    throwError: boolean,
    userId: number,
    retry = 1
  ) => {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const headers = { Authorization: `Bearer ${user.discordAccessToken}` };

    const discord = await lastValueFrom(observable(headers)).catch(
      (error) => error
    );
    if (axios.isAxiosError(discord)) {
      if (discord.response.status === 401) {
        if (!retry) {
          logtail.error(discord);
          throw new BadRequestException(
            PARTICIPANT_ERROR.DISCORD_AUTH_TOKEN_EXPIRED
          );
        }

        const updatedUser = await this.refreshDiscordAccessToken(user);

        return await this.discordRequestWrapper(
          observable,
          throwError,
          updatedUser.id,
          retry - 1
        );
      }

      logtail.error(discord);
      if (throwError) {
        throw new BadRequestException(API_ERROR.SOMETHING_WENT_WRONG);
      }
      return { data: null, error: discord.message };
    } else if (discord.status > 199 && discord.status < 299) {
      return { data: discord.data, error: null };
    }
  };

  getUserDiscordServers = async (user: UserModel) => {
    const API = `${process.env.DISCORD_API}/users/@me/guilds`;
    const res = await this.discordRequestWrapper(
      (headers) => this.httpService.get(API, { headers }),
      true,
      user.id
    );

    if (res.error) {
      throw new BadRequestException(API_ERROR.SOMETHING_WENT_WRONG);
    }

    return res.data;
  };

  checkDiscordRole = async (
    discordServer: DiscordServer & {
      discordRoles: DiscordRole[];
    },
    user: UserModel
  ) => {
    const API = `${process.env.DISCORD_API}/users/@me/guilds/${discordServer.discordServerId}/member`;

    const res = await this.discordRequestWrapper(
      (headers) => this.httpService.get(API, { headers }),
      false,
      user.id
    );

    if (res.error) {
      return {
        error: res.error,
        requirementMet: false,
      };
    }

    let rolesRequirementMet = !discordServer.discordRoles.length;
    if (discordServer.discordRoles.length) {
      const rolesUserHave = discordServer.discordRoles.filter((r) =>
        res.data.roles.includes(r.roleId)
      );

      rolesRequirementMet =
        discordServer.discordRolesUseType === COMPOUND_REQUIREMENT_USE_TYPE.ALL
          ? rolesUserHave.length === discordServer.discordRoles.length
          : rolesUserHave.length !== 0;
    }

    return {
      error: null,
      requirementMet: rolesRequirementMet,
    };
  };

  getTryAgainErrorText = (sec: string) => {
    return `Try again in ${sec} seconds`;
  };

  getRolesRequirementForServerErrorText = (serverNames: string) => {
    return `Role requirement for server ${serverNames} not met`;
  };
}
