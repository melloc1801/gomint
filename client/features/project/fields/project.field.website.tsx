import { Field, FieldProps } from 'formik';

import { GlobalIcon } from '../../../public/assets/icons';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';

export const ProjectFieldWebsite = () => {
  return (
    <Label title="Website">
      <Field name="websiteURL">
        {({ field, meta }: FieldProps) => {
          let error: string | undefined;

          if (meta.error && meta.touched) {
            error = meta.error;
          }

          return (
            <Input
              type="text"
              error={error}
              icon={GlobalIcon}
              placeholder="https://gomint.art"
              {...field}
            />
          );
        }}
      </Field>
    </Label>
  );
};
