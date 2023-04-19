import { Field, FieldProps } from 'formik';
import React from 'react';

import { Input } from './Input';
import { Label } from './Label';

type DynamicFieldNameProps = {
  name: string;
  title?: string;
  prefix?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder: string;
  type: 'text' | 'number';
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export const InputField: React.FC<DynamicFieldNameProps> = ({
  name,
  type,
  icon,
  title,
  prefix,
  disabled,
  required,
  inputProps,
  placeholder,
}) => {
  return (
    <Label title={title} required={required}>
      <Field required={true} name={name}>
        {({ field, meta }: FieldProps) => {
          let error: string | undefined;
          if (meta.error && meta.touched) {
            error = meta.error;
          }

          return (
            <Input
              {...field}
              type={type}
              icon={icon}
              error={error}
              {...inputProps}
              prefix={prefix}
              disabled={disabled}
              placeholder={placeholder}
            />
          );
        }}
      </Field>
    </Label>
  );
};
