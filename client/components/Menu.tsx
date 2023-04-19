import * as React from 'react';

import { Menu as M, Transition } from '@headlessui/react';

import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import cx from 'classnames';

export const Menu = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  return (
    <M as="div" className="relative">
      {({ open }) => (
        <>
          <M.Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
            className={cx(
              'flex items-center justify-center rounded-full shadow cursor-pointer w-7 h-7',
              { 'bg-white shadow-slate-200': !open, 'bg-blue-600': open }
            )}>
            <EllipsisVerticalIcon className={cx({ 'text-white': open }, 'w-4 h-4')} />
          </M.Button>

          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-75"
            leaveTo="transform opacity-0 scale-95"
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leaveFrom="transform opacity-100 scale-100">
            <M.Items className="absolute right-0 mt-2 text-sm font-medium origin-top-right bg-white border divide-y rounded shadow-md w-44 divide-slate-100">
              {Array.isArray(children) ? (
                children.map((child, idx) => <M.Item key={idx}>{child}</M.Item>)
              ) : (
                <M.Item>{children}</M.Item>
              )}
            </M.Items>
          </Transition>
        </>
      )}
    </M>
  );
};
