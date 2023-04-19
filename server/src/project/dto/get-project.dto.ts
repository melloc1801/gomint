import { Exclude, Expose } from "class-transformer";

import { GetPhaseDto } from "src/phase/dto/get-phase.dto";
import { UpdateProjectDto } from "./project.update.dto";

@Exclude()
export class GetProjectDto extends UpdateProjectDto {
  @Expose()
  isOwner: boolean;

  @Expose()
  isController: boolean;

  @Expose()
  premium: boolean;

  @Expose()
  phases: GetPhaseDto;
}
