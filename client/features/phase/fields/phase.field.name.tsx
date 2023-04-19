import { Field, FieldProps, useFormikContext } from 'formik';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { PhaseType } from '../utils/phase.utils.types';
import React from 'react';

export const PhaseFieldName: React.FC = () => {
  const { setFieldValue } = useFormikContext<PhaseType>();

  return (
    <Label title="Title" required>
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
              placeholder="Enter title"
              {...field}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('name', e.target.value);
              }}
            />
          );
        }}
      </Field>
    </Label>
  );
};
