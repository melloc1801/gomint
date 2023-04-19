import { Field, FieldProps, useFormikContext } from 'formik';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { ProjectType } from '../utils/project.utils.types';
import { createSlug } from '../utils/project.utils.helpers';

export const ProjectFieldName = ({ isManualSlug = true }: { isManualSlug?: boolean }) => {
  const { setFieldValue } = useFormikContext<ProjectType>();

  return (
    <Label title="Project name" required>
      <Field name="name">
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
              icon={DocumentTextIcon}
              placeholder="Your awesome project"
              {...field}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('name', e.target.value);
                !isManualSlug && setFieldValue('slug', createSlug(e.target.value));
              }}
            />
          );
        }}
      </Field>
    </Label>
  );
};
