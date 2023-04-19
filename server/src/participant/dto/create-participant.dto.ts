import { IsEthereumAddress } from "class-validator";

export class CreateParticipantDto {
  @IsEthereumAddress()
  registrationAddress: string;
}
