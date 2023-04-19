import * as Yup from 'yup';

export const profileValidation = Yup.object().shape({
  email: Yup.string().email().optional(),
  username: Yup.string()
    .matches(/^[ \w.-]+$/, 'Only letters and numbers are allowed')
    .max(32)
    .optional(),
});

export const WalletValidation = Yup.object().shape({
  label: Yup.string()
    .max(32)
    .matches(/^[ \w.-]+$/, 'Only letters and numbers are allowed'),
});
