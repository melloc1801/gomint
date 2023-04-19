import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
} from "class-validator";

export enum SortBy {
  createdAt = "createdAt",
  participants = "participants",
  registrationEnd = "registrationEnd",
}

export class GetPhasesQueryParamsDto {
  @IsOptional()
  @IsPositive()
  @Transform((dto) => Number(dto.value))
  page: number;

  @Max(300)
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform((dto) => Number(dto.value))
  limit: number;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(SortBy)
  sort: SortBy;

  @IsOptional()
  @IsNotEmpty()
  searchText: string;

  @IsOptional()
  @IsBooleanString()
  includeEnded: string;
}
