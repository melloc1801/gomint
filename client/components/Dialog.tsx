import { Dialog as D, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

type DialogChildrenProps = {
  close: () => void;
  open: () => void;
};

type Props = {
  title?: string;
  subtitle?: string;
  children: (props: DialogChildrenProps) => React.ReactNode;
  button: (props: DialogChildrenProps) => React.ReactNode;
};

export const Dialog = ({ children, title, subtitle, button }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="inset-0 flex items-center ">{button({ close, open })}</div>

      <Transition appear show={isOpen} as={Fragment}>
        <D as="div" className="relative z-10" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <D.Panel className="w-full max-w-md p-10 overflow-hidden transition-all transform bg-white shadow-xl rounded-[10px]">
                  {title ? (
                    <D.Title className="pb-3 text-2xl font-semibold text-gomint-dark-blue">
                      {title}
                    </D.Title>
                  ) : null}
                  {subtitle ? (
                    <D.Description className="font-light text-gomint-dark-blue">
                      {subtitle}
                    </D.Description>
                  ) : null}
                  {children({ close, open })}
                </D.Panel>
              </Transition.Child>
            </div>
          </div>
        </D>
      </Transition>
    </>
  );
};
