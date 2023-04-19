import { Field, FieldProps } from 'formik';

import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { TwitterIcon } from '../../../public/assets/icons';

export const ProjectFieldTwitter = () => {
  return (
    <Label title="Twitter username">
      <Field name="twitterURL">
        {({ field, meta }: FieldProps) => {
          let error: string | undefined;

          if (meta.error && meta.touched) {
            error = meta.error;
          }

          return (
            <Input
              type="text"
              error={error}
              icon={TwitterIcon}
              placeholder="@gomintnft"
              {...field}
            />
          );
        }}
      </Field>
    </Label>
  );
};
