import * as Yup from 'yup';

import { VALIDATION_MESSAGES } from '../../../lib/validationMessages';

export const ReportValidationSchema = Yup.object().shape({
  message: Yup.string()
    .required('Required')
    .min(20, VALIDATION_MESSAGES.TOO_SHORT)
    .max(500, VALIDATION_MESSAGES.TOO_LONG),
});
