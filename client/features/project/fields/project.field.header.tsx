import * as React from 'react';

import { Field, useFormikContext } from 'formik';

import { CloseCircle } from '../../../components/CloseCircle';
import { Label } from '../../../components/Label';
import { ProjectType } from '../utils/project.utils.types';
import { UploadFileIcon } from '../../../public/assets/icons';
import cx from 'classnames';
import set from 'lodash/set';
import { uploadImage } from '../../../lib/upload';

export const ProjectFieldHeader = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { values, setFieldValue } = useFormikContext<ProjectType>();

  const headerBackgroundStyles = {
    backgroundImage: values.headerURL ? `url('${values.headerURL}')` : 'none',
  };

  if (values.headerColor) {
    set(headerBackgroundStyles, 'backgroundColor', values.headerColor);
  }

  const selected = values.headerColor || values.headerURL;

  React.useEffect(() => {
    if (ref.current) {
      const height = ref.current.offsetWidth / 3;
      ref.current.style.height = `${height < 200 ? 200 : height}px`;
    }
  }, []);

  return (
    <Label title="Cover image">
      <div
        ref={ref}
        style={headerBackgroundStyles}
        onClick={(e) => (selected ? e.preventDefault() : null)}
        className={cx(
          {
            'border-dashed border': !selected,
          },
          'relative mb-8 rounded group hover:border-blue-500 hover:cursor-pointer hover:bg-blue-25 bg-cover transition-all ease-in-out bg-center'
        )}>
        <div className="flex flex-col items-center justify-center h-full">
          {selected ? (
            <CloseCircle
              onRemove={() => {
                setFieldValue('headerURL', '');
                setFieldValue('headerColor', '');
              }}
            />
          ) : null}

          {selected ? null : (
            <UploadFileIcon className="mb-6 transition-all ease-in-out h-14 text-slate-300 group-hover:text-blue-500" />
          )}
          <div
            className={cx({
              'invisible h-0': selected,
            })}>
            Upload banner or{' '}
            <Field
              value=""
              type="file"
              name="headerURL"
              className="hidden"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('headerURL', await uploadImage(e));
              }}
            />
            <label>
              <span className="text-blue-500 underline cursor-pointer hover:no-underline">
                select color
              </span>
              <Field name="headerColor" type="color" className="invisible w-0" />
            </label>
          </div>
          {selected ? null : (
            <div className="mt-2 text-xs text-slate-400">Recommended size 1500x500 pixels.</div>
          )}
        </div>
      </div>
    </Label>
  );
};
