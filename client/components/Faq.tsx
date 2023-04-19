import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Disclosure } from '@headlessui/react';
import React from 'react';
import cx from 'classnames';

const FAQ_ITEMS = [
  {
    question: 'How much does the premium pass cost?',
    answer: 'The premium pass costs 1 ETH, right now, for early believers we have special rates.',
  },
  {
    question: 'How many projects is the premium pass good for?',
    answer: 'You can create unlimited projects with your premium pass.',
  },
  {
    question: 'How long is the premium pass valid for?',
    answer:
      'It is lifetime access, no subscription or renewal fees apply for as long as the service exists.',
  },
  {
    question: 'Can I share my premium pass with other people on my team?',
    answer:
      'You can add team members to administer individual projects, but there is no way to share the premium pass across wallets. The premium pass will only unlock features for the wallet it is activated in.\n',
  },
  {
    question: 'Can I buy a premium pass from other people / from OpenSea or other marketplaces?',
    answer:
      'You should only buy a premium pass from our website. Every other premium pass from another source will not work and you will have wasted money.',
  },
  {
    question: 'Can I create access lists or projects for my friends or projects I advise?',
    answer:
      'No, you can only use the premium pass for your own projects. If you use it for other projects and GOMINT sees this, we have the right to de-activate your premium pass.',
  },
];

export const Faq: React.FC = () => {
  return (
    <div>
      {FAQ_ITEMS.map((item, index) => (
        <div
          className={cx({
            'mb-7 pb-7 border-b border-slate-300 border-opacity-50': index !== FAQ_ITEMS.length,
          })}
          key={item.question + item.answer}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="grid w-full grid-cols-12 md:gap-x-8">
                  <div className="col-span-10 pr-4 text-xl font-medium text-left md:text-2xl md:pr-0">
                    {item.question}
                  </div>
                  <button className="flex items-center justify-center col-span-2 bg-white bg-opacity-75 rounded-full shadow-md justify-self-end w-9 h-9 md:mr-7 rounden-full">
                    <ChevronDownIcon
                      className={cx({ 'rotate-180': open }, 'text-gomint-blue w-6 h-6')}
                    />
                  </button>
                </Disclosure.Button>
                <Disclosure.Panel className="grid grid-cols-12 pt-6">
                  <div className="col-span-10">{item.answer}</div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  );
};
