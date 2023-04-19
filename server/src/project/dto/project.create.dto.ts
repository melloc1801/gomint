import { Exclude, Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

import { UpdateProjectDto } from "./project.update.dto";
import { trim } from "utils";

@Exclude()
export class CreateProjectDto extends UpdateProjectDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  slug: string;
}
