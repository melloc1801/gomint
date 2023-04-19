import { ArrayNotEmpty, IsArray, IsEthereumAddress } from "class-validator";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CreateParticipantsManuallyDto {
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @IsEthereumAddress({ each: true })
  addresses: string[];
}
