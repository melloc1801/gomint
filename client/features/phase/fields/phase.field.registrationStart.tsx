import { Field, FieldProps, useFormikContext } from 'formik';

import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { PhaseType } from '../utils/phase.utils.types';
import React from 'react';

export const PhaseFieldRegistrationStart: React.FC = () => {
  const { setFieldValue } = useFormikContext<PhaseType>();

  return (
    <Label title="Registration start">
      <Field name="registrationStart">
        {({ field, meta }: FieldProps) => {
          let error: string | undefined;

          if (meta.error && meta.touched) {
            error = meta.error;
          }

          return (
            <Input
              type="datetime-local"
              error={error}
              {...field}
              value={field.value}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('registrationStart', e.target.value);
              }}
            />
          );
        }}
      </Field>
    </Label>
  );
};
