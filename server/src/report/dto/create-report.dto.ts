import { Exclude, Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

import { trim } from "utils";

@Exclude()
export class CreateReportDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(trim)
  message: string;
}
