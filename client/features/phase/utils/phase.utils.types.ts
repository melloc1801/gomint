import { ProjectType } from '../../project/utils/project.utils.types';
import React from 'react';

export type DynamicFieldNameProps = { name: string };

export type DiscordRole = {
  roleName: string;
  roleId: string;
};

export type DiscordServerType = {
  discordServerId: string;
  discordServerName: string;
  discordServerLink: string;
  discordRoles: DiscordRole[];
  discordRolesUseType: 'ALL' | 'ANY';
};

export type TwitterAccount = {
  account: string;
  link: string;
};

export type PhaseType = {
  name: string;
  outerId: number;
  type: 'LIMIT' | 'RAFFLE';
  minEth: number | string | null;
  registrationEnd?: string;
  registrationStart?: string;
  mintPrice?: number | string | null;
  mintsPerWinner?: number | string | null;
  numberOfWinners: number | string | null;
  participantsCount?: number;
  winnersCount?: number;
  winnersFilePath?: string | null;
  collectionName?: string;
  collectionLink?: string;
  collectionAddress?: string;
  emailRequired?: boolean;
  discordServers: DiscordServerType[];
  discordServersUseType?: 'ANY' | 'ALL';

  project?: ProjectType;

  twitterAccounts: Array<{
    link: string;
    account: string;
  }>;

  collections: Array<{
    collectionAddress: string;
    collectionLink: string;
    collectionName: string;
    amount: number;
  }>;

  tweets: Array<{
    link: string;
    like: boolean;
    retweet: boolean;
    tagAmount: number | null;
  }>;

  tweetsUseType: 'ANY' | 'ALL';
  collectionsUseType: 'ANY' | 'ALL';
  twitterAccountsUseType: 'ANY' | 'ALL';

  favorite: boolean;
  favoriteCount: number;
};

export type ParticipantType = {
  address: string;
  winner: boolean;
  createdAt: string;
  discordUserName?: string;
  twitterUserName?: string;
  registrationAddress: string;
};

export type ParticipantPaginationType = {
  totalCount: number;
  nextCursor: number | null;
  participants: ParticipantType[];
};

export type Order = 'asc' | 'desc';
export type Column = 'address' | 'discordUserName' | 'twitterUserName' | 'createdAt' | 'winner';

export type DiscordFieldProps = {
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
