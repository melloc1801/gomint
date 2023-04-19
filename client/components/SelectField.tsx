import cx from 'classnames';
import { Field, FieldProps } from 'formik';
import * as React from 'react';

import { Listbox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

import { Label } from './Label';

type OptionType = { label: string; value: string };
type Props = {
  name: string;
  title?: string;
  className?: string;
  options: Array<OptionType>;
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export const SelectField = ({ options, icon, title, name }: Props) => {
  const Icon = icon;

  return (
    <Label title={title}>
      <Field name={name}>
        {({ field, meta, form }: FieldProps) => {
          const selected = options.find((option) => option.value === field.value);
          return (
            <>
              <Listbox value={field.value} onChange={(value) => form.setFieldValue(name, value)}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="relative flex items-center w-full p-2.5 text-left border rounded cursor-default">
                      {Icon ? (
                        <div className="mr-2.5">
                          <Icon className="w-5 h-5 text-slate-300" />
                        </div>
                      ) : null}
                      <span className="block truncate">{selected?.label}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon
                          className={cx({ rotate180: open }, 'w-5 h-5 text-gray-400')}
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full py-2 mt-1 overflow-auto bg-white border rounded">
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) => {
                            return `relative py-2 pl-10 pr-2 hover:bg-slate-50 ${
                              active ? 'bg-blue-50' : 'bg-white'
                            }`;
                          }}
                          value={option.value}>
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}>
                                {option.label}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </Listbox>
              {meta.error ? (
                <div className="mb-1 text-xs text-red-500">
                  &nbsp; {/* Empty space to maintain block height */}
                  {meta.error}
                </div>
              ) : null}
            </>
          );
        }}
      </Field>
    </Label>
  );
};
