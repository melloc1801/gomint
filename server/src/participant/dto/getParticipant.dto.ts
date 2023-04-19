import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GetParticipantDto {
  @Expose()
  address: string;

  @Expose()
  discordUserName: string;

  @Expose()
  twitterUserName: string;

  @Expose()
  createdAt: string;

  @Expose()
  winner: boolean;

  @Expose()
  registrationAddress: string;
}
