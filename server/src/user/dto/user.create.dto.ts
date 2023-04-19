import { Exclude, Expose } from "class-transformer";
import { IsEthereumAddress, IsNotEmpty, IsOptional } from "class-validator";

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @Expose()
  @IsOptional()
  nonce: string;
}
