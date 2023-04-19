import { Field, FieldProps, useFormikContext } from 'formik';

import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { ProjectType } from '../utils/project.utils.types';
import { createSlug } from '../utils/project.utils.helpers';

export const ProjectFieldSlug = ({ becomeManual }: { becomeManual?: () => void }) => {
  const { setFieldValue } = useFormikContext<ProjectType>();
  return (
    <Label title="Custom URL" required>
      <Field name="slug">
        {({ field, meta }: FieldProps) => {
          let error: string | undefined;

          if (meta.error && meta.touched) {
            error = meta.error;
          }

          return (
            <Input
              required
              type="text"
              error={error}
              prefix="gomint.art/"
              placeholder="awesome-project-url"
              {...field}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.code === 'Space') {
                  e.preventDefault();
                  setFieldValue('slug', `${field.value}-`);
                }
              }}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                becomeManual ? becomeManual() : null;
                setFieldValue('slug', createSlug(e.target.value));
              }}
            />
          );
        }}
      </Field>
    </Label>
  );
};
