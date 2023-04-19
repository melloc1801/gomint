import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, ValidateIf } from "class-validator";

@Exclude()
export class UpdateUserDto {
  @Expose()
  @IsEmail()
  @IsOptional()
  @ValidateIf((dto) => dto.email !== "")
  email: string;

  @Expose()
  @IsString()
  @IsOptional()
  username: string;
}
