import { Exclude, Expose } from "class-transformer";
import { IsEthereumAddress, IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class SigninAuthDto {
  @Expose()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @Expose()
  @IsString()
  signature: string;
}
