import axios, { AxiosError, AxiosResponse } from 'axios';

import toast from 'react-hot-toast';

export const ERRORS: { [key: string]: string } = {
  USER_ERROR_BANNED: 'You are banned by the GOMINT team',
  AUTH_ERROR_AUTHORIZATION_LINK_EXPIRED: 'Authorization link expired',
  PARTICIPANT_ERROR_PROJECT_NOT_FOUND: 'Project not found',
  PARTICIPANT_ERROR_ACCESS_FORBIDEN: 'Access denied',
  PARTICIPANT_ERROR_ALREADY_REGISTERED: 'You already registered the current access list',
  PHASE_ERROR_REGISTRATION_NOT_STARTED: 'Registration not found',
  REGISTRATION_ENDED: 'Registration ended',
  PHASE_ERROR_NO_REGISTRATION: 'No registration',
  PHASE_ERROR_NOT_ENOUGH_BALANCE: 'Your ETH balance is not sufficient',
  PARTICIPANT_ERROR_NOT_MEMBER_OF_REQUIRED_GUILD: 'You are not part of the required Discord server',
  PARTICIPANT_ERROR_HAS_NONE_OF_REQUIRED_ROLES: "You don't have the required Discord role",
  PARTICIPANT_ERROR_DISCORD_AUTH_TOKEN_EXPIRED: 'Discord auth token expired',
  PARTICIPANT_ERROR_TWITTER_API_MET_LIMIT: 'Twitter api limit exceeded',
  PARTICIPANT_ERROR_TWITTER_NOT_FOLLOWING: "You don't meet the Twitter requirement",
  PARTICIPANT_ERROR_NFTS_NOT_FOUND: "You don't meet the NFT requirement",
  PARTICIPANT_ERROR_DISCORD_NOT_CONNECTED: 'You are not connected to Discord',
  PARTICIPANT_ERROR_TWITTER_NOT_CONNECTED: 'You are not connected to Twitter',
  PARTICIPANT_ERROR_EMAIL_REQUIRED: 'You have not connected your email',
  PARTICIPANT_ERROR_DISCORD_ERROR: 'Discord error',
  PHASE_ERROR_MIN_PRICE_IN_WEI_LESS_THAN_1: 'Min Ethereum requirement must be at least 1 wei',
  PHASE_ERROR_PHASE_NOT_FOUND: 'Access list not found',
  PHASE_ERROR_NOT_VALID_DISCORD_LINK: 'Invalid Discord link',
  PHASE_ERROR_NOT_VALID_TWITTER_LINK: 'Invalid Twitter link',
  PHASE_ERROR_DRAW_WHILE_REGISTRATION_OPENED: 'Registration is open yet',
  PHASE_ERROR_NO_SPOTS_AVAILABLE: 'No available spots',
  PROJECT_ERROR_PROJECT_ALREADY_EXISTS: 'Project already exists',
  PROJECT_ERROR_PROJECT_NOT_FOUND: 'Project not found',
  PROJECT_ERROR_ACCESS_FORBIDEN: 'Access denied',
  PROJECT_ERROR_USER_INACTIVE: "You weren't activated by the GOMINT team",
  PROJECT_ERROR_USING_OWN_ADDRESS_FOR_CONTROLLER: "Don't use your own address as manager",
  PROJECT_ERROR_CONTROLLER_ATTEMPT_CHANGE_CONTROLLERS: 'Manager is not able to change controller',
  REPORT_ERROR_ALREADY_EXISTS: 'Report already exists',
  REPORT_ERROR_NOT_FOUND: 'Report not found',
  USER_ERROR_NO_SUCH_ACCOUNT: 'There is no such account',
  USER_ERROR_EMAIL_VERIFICATION_CODE_EXPIRED: 'Email verification code expired',
  USER_ERROR_NOT_APPROPRIATE_TIER: 'There is no appropriate tier',
  PROJECT_ERROR_PROJECT_NAME_IS_TAKEN: 'Project name is taken',
  PROJECT_ERROR_PROJECT_SLUG_IS_TAKEN: 'Project slug is taken',
  PHASE_ERROR_PHASE_NAME_USED: 'Access list name is taken',
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later!',
  USER_ERROR_NOT_MINTER: 'Activation error. Contact GOMINT team',
  USER_ERROR_DISCORD_ACCOUNT_IN_USE: 'Discord account already in use',
  USER_ERROR_TWITTER_ACCOUNT_IN_USE: 'Twitter account already in use',
  PROJECT_ERROR_REPEATABLE_CONTROLLERS_ADDRESSES:
    'One of the team members already exists. Remove duplicates.',
  PARTICIPANT_ERROR_PARTICIPANT_NOT_FOUND: 'Participant not found',
  PARTICIPANT_ERROR_PARTICIPANT_NOT_ADDED: 'Invalid participants',
  PARTICIPANT_ERROR_INVALID_PARTICIPANT_ADDRESS: 'Invalid participant address',
  API_ERROR_SOMETHING_WENT_WRONG: 'Something went wrong. Try again later',
  USER_ERROR_WALLET_IN_USE: 'This wallet was connected to different account',
  USER_ERROR_USERNAME_IN_USE: 'Username is already taken',
};

export const handleErrors = (error: AxiosError) => {
  if (error instanceof Error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const response = error.response as AxiosResponse;
        const DEFAULT_MESSAGE = 'Something went wrong. Try again later';

        if (response.status === 429) {
          toast.error(ERRORS.TOO_MANY_REQUESTS, {
            id: ERRORS.TOO_MANY_REQUESTS,
          });
          return;
        }

        if (response.status === 401 && response.data?.message === 'Unauthorized') {
          return;
        }

        if (Array.isArray(response.data?.message)) {
          let hasUnknownError = false;
          response.data.message.forEach((element: string) => {
            const error = ERRORS[element];
            if (error) {
              toast.error(error, {
                id: error,
              });
              return;
            }
            hasUnknownError = true;
          });
          if (hasUnknownError) {
            toast.error(DEFAULT_MESSAGE, {
              id: DEFAULT_MESSAGE,
            });
          }

          return;
        }

        toast.error(ERRORS[response.data?.message] || response.data?.message, {
          id: response.data?.message || DEFAULT_MESSAGE,
        });
      }
    }
  }
};
