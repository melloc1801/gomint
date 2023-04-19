import { Exclude, Expose, Transform } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from "class-validator";

import { PHASE_TYPE } from "../enum/phase.enum";
import { UpdatePhaseDto } from "./phase.update.dto";
import { trim } from "utils";

@Exclude()
export class CreatePhaseDto extends UpdatePhaseDto {
  @Expose()
  @IsNotEmpty()
  @Transform(trim)
  @IsString()
  name: string;

  @Expose()
  @IsEnum(PHASE_TYPE)
  type: string;

  @Expose()
  @IsPositive()
  @IsInt()
  numberOfWinners: number;

  @Expose()
  @IsPositive()
  @IsInt()
  mintsPerWinner: number;
}
