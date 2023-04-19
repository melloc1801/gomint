import { Exclude, Expose } from "class-transformer";
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

@Exclude()
export class AddWalleltDto {
  @Expose()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((dto) => dto.label !== "")
  label: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  signature: string;
}
