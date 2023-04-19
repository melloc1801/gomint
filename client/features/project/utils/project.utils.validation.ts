import * as Yup from 'yup';

import { VALIDATION_MESSAGES } from '../../../lib/validationMessages';
import { utils } from 'ethers';

export const EXCEPT_LINK_REGEX = /^[^.]+$/;
export const TWITTER_ACCOUNT_REGEX = /^@?(\w){1,15}$/;

Yup.addMethod(Yup.mixed, 'isEthereumAddress', function () {
  return this.test('isEthereumAddressTest', VALIDATION_MESSAGES.NOT_ETH_ADDRESS, function (value) {
    return utils.isAddress(value);
  });
});

const ControllersSchema = Yup.object().shape({
  address: Yup.string()
    .required('Required')
    .test('ethereum-address', VALIDATION_MESSAGES.NOT_ETH_ADDRESS, function (value) {
      return utils.isAddress(value as string);
    }),
});

export const ProjectValidationSchema = Yup.object().shape({
  description: Yup.array().optional().nullable(),
  headerColor: Yup.string().optional().nullable(),
  slug: Yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  controllers: Yup.array().of(ControllersSchema).optional(),
  websiteURL: Yup.string().url(VALIDATION_MESSAGES.MUST_BE_URL).nullable(),
  pfpURL: Yup.string().url(VALIDATION_MESSAGES.MUST_BE_URL).optional().nullable(),
  headerURL: Yup.string().url(VALIDATION_MESSAGES.MUST_BE_URL).optional().nullable(),
  discordURL: Yup.string().matches(EXCEPT_LINK_REGEX, VALIDATION_MESSAGES.INVALID_INPUT).nullable(),
  twitterURL: Yup.string()
    .matches(TWITTER_ACCOUNT_REGEX, VALIDATION_MESSAGES.INVALID_INPUT)
    .nullable(),
  name: Yup.string()
    .required('Required')
    .min(2, VALIDATION_MESSAGES.TOO_SHORT)
    .max(150, VALIDATION_MESSAGES.TOO_LONG),
});
