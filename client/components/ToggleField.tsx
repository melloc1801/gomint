import { Field, FieldProps } from 'formik';

import React from 'react';
import { Toggle } from './Toggle';
import { Typography } from './Typography';

export const ToggleField: React.FC<{
  name: string;
  text: string;
  className?: string;
}> = ({ name, text, className }) => {
  return (
    <div className="flex items-center gap-2">
      <Field name={name}>
        {({ meta, form }: FieldProps) => {
          return (
            <Toggle
              variant="primary"
              enabled={meta.value}
              onClick={() => form.setFieldValue(name, !meta.value)}
            />
          );
        }}
      </Field>
      <Typography className={className}>{text}</Typography>
    </div>
  );
};
