import { Exclude, Expose } from "class-transformer";

import { CreateUserDto } from "./user.create.dto";

@Exclude()
export class GetUserDto extends CreateUserDto {
  @Expose()
  active: boolean;
}
