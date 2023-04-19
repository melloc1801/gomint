import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  ValidateIf,
} from "class-validator";
import {
  PaginationOrderEnum,
  PaginationSortingColumnEnum,
} from "../enum/paginationOrder.enum";

import { Transform } from "class-transformer";
import { trim } from "utils";

export class GetAllQueryParamsDto {
  @Transform((params) => +params.value)
  @IsOptional()
  @IsPositive()
  @ValidateIf((dto) => dto.page !== 0)
  page: number;

  @Transform((params) => +params.value)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(300)
  limit: number;

  @Transform(trim)
  @IsOptional()
  @IsEnum(PaginationOrderEnum)
  order: PaginationOrderEnum;

  @Transform(trim)
  @IsOptional()
  @IsEnum(PaginationSortingColumnEnum)
  sortingColumn: PaginationSortingColumnEnum;
}
