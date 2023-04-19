import * as Yup from 'yup';

import {
  EXCEPT_LINK_REGEX,
  TWITTER_ACCOUNT_REGEX,
} from '../../project/utils/project.utils.validation';
import { VALIDATION_MESSAGES } from '../../../lib/validationMessages';
import { utils } from 'ethers';

export const AddParticipantsValidationSchema = Yup.object().shape({
  participants: Yup.string().transform((value: string) => {
    const rawAddresses = value.split(',');
    const addresses = rawAddresses.map((address) => address.trim());
    addresses.forEach((address) => {
      if (!address) {
        throw new Yup.ValidationError(
          new Yup.ValidationError(`Remove redundant comma`, value, 'participants', 'is-valid')
        );
      }
      if (!utils.isAddress(address)) {
        throw new Yup.ValidationError(
          new Yup.ValidationError(
            `${address} is not ethereum address`,
            value,
            'participants',
            'is-valid'
          )
        );
      }
    });
  }),
});

export const DiscordRoleSchema = Yup.object().shape({
  roleId: Yup.string().matches(/^\d+$/, { message: 'Not a number' }).required('Required'),
  roleName: Yup.string().required('Required'),
});

export const TwitterAccountSchema = Yup.object().shape({
  account: Yup.string()
    .matches(TWITTER_ACCOUNT_REGEX, VALIDATION_MESSAGES.INVALID_INPUT)
    .required('Required'),
});
export const TweetSchema = Yup.object().shape({
  link: Yup.string().url('Invalid url').required('Required'),
  tagAmount: Yup.number().positive('Must be a positive number'),
});
export const DiscordServerSchema = Yup.object().shape({
  discordServerId: Yup.string().matches(/^\d+$/, { message: 'Not a number' }).required('Required'),
  discordServerName: Yup.string().required('Required'),
  discordServerLink: Yup.string()
    .matches(EXCEPT_LINK_REGEX, VALIDATION_MESSAGES.INVALID_INPUT)
    .required('Required'),
  discordRoles: Yup.array().of(DiscordRoleSchema).optional(),
  discordRolesUseType: Yup.mixed().oneOf(['ANY', 'ALL']).optional(),
});
export const CollectionSchema = Yup.object().shape({
  collectionAddress: Yup.string()
    .matches(/^0x[a-fA-F0-9]{40}$/, {
      message: 'Not ethereum address',
    })
    .required('Required'),
  collectionName: Yup.string().required('Required'),
  collectionLink: Yup.string().url('Invalid url').required('Required'),
  amount: Yup.number().positive('Must be a positive number').required('Required'),
});

export const TwitterNameSchema = Yup.string().required("Mustn't be empty");

export const PhaseValidationSchema = Yup.object().shape({
  type: Yup.mixed().oneOf(['LIMIT', 'RAFFLE']).required('Required'),
  name: Yup.string().required('Required').min(2, 'Too Short').max(150, 'Too Long'),

  mintPrice: Yup.number()
    .positive('should be positive')
    .min(0.000001, 'should be more then 0,000001 eth'),
  mintsPerWinner: Yup.number().integer('should be integer').positive('should be positive'),
  numberOfWinners: Yup.number()
    .integer('should be integer')
    .positive('should be positive')
    .required('Required'),

  emailRequired: Yup.boolean().optional().nullable(),

  registrationEnd: Yup.string().optional().nullable(),
  registrationStart: Yup.string().optional().nullable(),

  minEth: Yup.number().min(0).nullable().optional(),
  discordServers: Yup.array().of(DiscordServerSchema),
  discordServersUseType: Yup.mixed().oneOf(['ANY', 'ALL']).optional(),
  collections: Yup.array().of(CollectionSchema),
  collectionsUseType: Yup.mixed().oneOf(['ANY', 'ALL']).optional(),
  twitterAccounts: Yup.array().of(TwitterAccountSchema).optional(),
  twitterAccountsUseType: Yup.mixed().oneOf(['ANY', 'ALL']).optional(),
  tweets: Yup.array().of(TweetSchema).optional(),
  tweetsUseType: Yup.mixed().oneOf(['ANY', 'ALL']).optional(),
});
