import { Exclude, Expose, Type } from "class-transformer";

import { GetProjectDto } from "src/project/dto/get-project.dto";
import { UpdatePhaseDto } from "./phase.update.dto";

@Exclude()
export class GetPhaseDto extends UpdatePhaseDto {
  @Expose()
  outerId: number;

  @Expose()
  winnersCount: number;

  @Expose()
  participantsCount: number;

  @Expose()
  winnersFilePath: string;

  @Expose()
  winner: boolean;

  @Expose()
  @Type(() => GetProjectDto)
  project: GetProjectDto;

  @Expose()
  favoriteCount: boolean;

  @Expose()
  favorite: boolean;
}
