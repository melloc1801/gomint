import { Exclude, Expose } from "class-transformer";
import { IsEthereumAddress, IsNotEmpty } from "class-validator";

@Exclude()
export class DeleteWalleltDto {
  @Expose()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;
}
