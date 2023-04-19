import { Exclude, Expose } from "class-transformer";

import { IsBoolean } from "class-validator";

@Exclude()
export class UpdateParticipantDto {
  @Expose()
  @IsBoolean()
  winner?: boolean;
}
