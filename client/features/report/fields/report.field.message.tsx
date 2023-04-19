import { Field, FieldProps, useFormikContext } from 'formik';

import { Report } from '../utils/report.utils.types';
import { Textarea } from '../../../components/Textarea';

export const ReportFieldName = () => {
  const { setFieldValue } = useFormikContext<Report>();

  return (
    <Field name="message">
      {({ field, meta }: FieldProps) => {
        let error: string | undefined;

        if (meta.error && meta.touched) {
          error = meta.error;
        }

        return (
          <Textarea
            error={error}
            placeholder="Enter your comment"
            {...field}
            onBlur={() => {}} // To prevent field from showing error when closing modal
            onChange={async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFieldValue('message', e.target.value);
            }}
          />
        );
      }}
    </Field>
  );
};
