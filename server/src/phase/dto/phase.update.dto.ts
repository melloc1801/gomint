import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
  Type,
} from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ethers } from "ethers";
import { trim } from "utils";

import { PHASE_ERROR } from "../enum/phase-error.enum";
import { COMPOUND_REQUIREMENT_USE_TYPE, PHASE_TYPE } from "../enum/phase.enum";

@Exclude()
export class DiscordRoleDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  roleName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  roleId: string;
}

@Exclude()
export class TweetDto {
  @Expose()
  @IsNotEmpty()
  @Transform(trim)
  @IsUrl(
    { host_whitelist: ["twitter.com"] },
    { message: PHASE_ERROR.NOT_VALID_TWITTER_LINK }
  )
  link: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  like: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  retweet: boolean;

  @Expose()
  @IsOptional()
  @IsPositive()
  tagAmount: number;
}

@Exclude()
export class DiscordServerDto {
  @Expose()
  @Transform(trim)
  @ValidateIf((dto) => dto.discordServerId !== "")
  @IsNumberString({ no_symbols: true })
  discordServerId: string;

  @Expose()
  @IsString()
  @ValidateIf((dto) => dto.discordServerName !== "")
  @Transform(trim)
  discordServerName: string;

  @Expose()
  @Transform(trim)
  @ValidateIf((dto) => dto.discordServerLink !== "")
  @IsUrl(
    { host_whitelist: ["discord.gg", "discord.com"] },
    { message: PHASE_ERROR.NOT_VALID_DISCORD_LINK }
  )
  discordServerLink: string;

  @Expose()
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => DiscordRoleDto)
  discordRoles: DiscordRoleDto[];

  @Expose()
  @IsOptional()
  @IsEnum(COMPOUND_REQUIREMENT_USE_TYPE)
  discordRolesUseType: COMPOUND_REQUIREMENT_USE_TYPE;
}

@Exclude()
export class CollectionDto {
  @Expose()
  @IsEthereumAddress()
  @Transform((transformFnParams: TransformFnParams) => {
    transformFnParams.value = trim(transformFnParams);
    transformFnParams.value = ethers.utils.getAddress(transformFnParams.value);
    return transformFnParams.value;
  })
  collectionAddress: string;

  @Expose()
  @IsString()
  @Transform(trim)
  collectionName: string;

  @Expose()
  @IsUrl()
  @Transform(trim)
  collectionLink: string;

  @Expose()
  @IsPositive()
  amount: number;
}

@Exclude()
export class TwitterAccountDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim().replace("@", ""))
  account: string;
}

@Exclude()
export class UpdatePhaseDto {
  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  name: string;

  @Expose()
  @IsOptional()
  @IsEnum(PHASE_TYPE)
  type: string;

  @Expose()
  @IsDateString()
  @IsOptional()
  registrationStart: Date;

  @Expose()
  @IsDateString()
  @IsOptional()
  registrationEnd: Date;

  @Expose()
  @IsPositive()
  @IsOptional()
  @ValidateIf((dto) => dto.minEth !== 0)
  minEth: number;

  @Expose()
  @IsPositive()
  @IsOptional()
  mintPrice: number;

  @Expose()
  @IsOptional()
  @IsPositive()
  @IsInt()
  numberOfWinners: number;

  @Expose()
  @IsOptional()
  @IsPositive()
  @IsInt()
  mintsPerWinner: number;

  @Expose()
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => CollectionDto)
  collections: CollectionDto[];

  @Expose()
  @IsOptional()
  @IsEnum(COMPOUND_REQUIREMENT_USE_TYPE)
  collectionsUseType: COMPOUND_REQUIREMENT_USE_TYPE;

  @Expose()
  @IsOptional()
  @IsEthereumAddress()
  @ValidateIf((dto) => dto.collectionAddress !== "")
  @Transform(trim)
  collectionAddress: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.collectionName !== "")
  @Transform(trim)
  collectionName: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  @Transform(trim)
  @ValidateIf((dto) => dto.collectionLink !== "")
  collectionLink: string;

  @Expose()
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => DiscordServerDto)
  discordServers: DiscordServerDto[];

  @Expose()
  @IsOptional()
  @IsEnum(COMPOUND_REQUIREMENT_USE_TYPE)
  discordServersUseType: COMPOUND_REQUIREMENT_USE_TYPE;

  @Expose()
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => TwitterAccountDto)
  twitterAccounts: TwitterAccountDto[];

  @Expose()
  @IsOptional()
  @IsEnum(COMPOUND_REQUIREMENT_USE_TYPE)
  twitterAccountsUseType: COMPOUND_REQUIREMENT_USE_TYPE;

  @Expose()
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => TweetDto)
  tweets: TweetDto[];

  @Expose()
  @IsOptional()
  @IsEnum(COMPOUND_REQUIREMENT_USE_TYPE)
  tweetsUseType: COMPOUND_REQUIREMENT_USE_TYPE;

  @Expose()
  @IsBoolean()
  @IsOptional()
  emailRequired: boolean;
}
