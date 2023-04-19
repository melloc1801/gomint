import { PhaseType } from '../../phase/utils/phase.utils.types';

export type ProjectType = {
  name: string;
  slug: string;
  pfpURL: string;
  isOwner: boolean;
  premium: boolean;
  headerURL: string;
  websiteURL: string;
  discordURL: string;
  twitterURL: string;
  headerColor: string;
  description: string;
  isController: boolean;
  phasesPublished: boolean;

  phases: PhaseType[];
  controllers: Controller[];
};

export type Controller = {
  address: string;
};
