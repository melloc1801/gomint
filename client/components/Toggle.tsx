import * as React from 'react';

import { Switch } from '@headlessui/react';
import cx from 'classnames';
import { isBoolean } from 'lodash';

type ToggleProps = {
  onClick: (value: boolean) => void;
  enabled?: boolean;
  variant?: 'primary' | 'success';
};
export const Toggle: React.FC<ToggleProps> = ({ variant = 'primary', ...props }) => {
  const [enabled, setEnabled] = React.useState(props.enabled);

  React.useEffect(() => {
    if (isBoolean(props.enabled) && props.enabled !== enabled) {
      setEnabled(props.enabled);
    }
  }, [props.enabled, enabled]);

  const toggleEnabledStyles = cx({
    'bg-blue-500': variant === 'primary',
    'bg-green-500': variant === 'success',
  });

  return (
    <Switch
      checked={enabled || false}
      onChange={(status: boolean) => {
        props.onClick(status);
        setEnabled(status);
      }}
      className={`${enabled ? toggleEnabledStyles : 'bg-white'}
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full shadow-inner border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-blue-200'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
};
