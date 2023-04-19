import {
  ArrayUnique,
  IsBoolean,
  IsEthereumAddress,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Exclude, Expose, Transform, Type } from "class-transformer";

import { PHASE_ERROR } from "src/phase/enum/phase-error.enum";
import { PROJECT_ERROR } from "../enum/project-error.enum";
import { Prisma } from "@prisma/client";
import { trim } from "utils";

export class ControllerDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  @Transform(trim)
  address: string;
}

@Exclude()
export class GetControllerDto {
  @Expose()
  address: string;
}

@Exclude()
export class UpdateProjectDto {
  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  slug: string;

  @Expose()
  @IsString()
  @Transform(trim)
  @IsOptional()
  description: Prisma.JsonValue;

  @Expose()
  @ValidateIf((dto) => dto.websiteURL !== "")
  @IsUrl()
  @IsOptional()
  @Transform(trim)
  websiteURL: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(trim)
  headerColor: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(trim)
  headerURL: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.pfpURL !== "")
  @Transform(trim)
  pfpURL: string;

  @Expose()
  @IsUrl(
    { host_whitelist: ["twitter.com"] },
    { message: PHASE_ERROR.NOT_VALID_TWITTER_LINK }
  )
  @IsOptional()
  @ValidateIf((dto) => dto.twitterURL !== "")
  @Transform(trim)
  twitterURL: string;

  @Expose()
  @IsUrl(
    { host_whitelist: ["discord.gg", "discord.com"] },
    { message: PHASE_ERROR.NOT_VALID_DISCORD_LINK }
  )
  @IsOptional()
  @ValidateIf((dto) => dto.discordURL !== "")
  @Transform(trim)
  discordURL: string;

  @Expose()
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => ControllerDto)
  @ArrayUnique((object: ControllerDto) => object.address, {
    message: PROJECT_ERROR.REPEATABLE_CONTROLLERS_ADDRESSES,
  })
  controllers: ControllerDto[];

  @Expose()
  @IsBoolean()
  @IsOptional()
  phasesPublished: boolean;
}
