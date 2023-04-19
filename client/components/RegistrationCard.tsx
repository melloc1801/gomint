import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import set from 'lodash/set';

type RegistrationCard = {
  name: string;
  slug: string;
  pfp?: string;
  color?: string;
  image?: string;
  onCancel: () => void;
};

export const RegistrationCard = (props: RegistrationCard) => {
  const headerBackgroundStyles = {};

  if (props.color) {
    set(headerBackgroundStyles, 'backgroundColor', props.color);
  }

  return (
    <Link passHref href={props.slug}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="relative block p-3 no-underline transition ease-in-out border rounded shadow-none cursor-pointer hover:shadow shadow-slate-50 border-slate-200">
        <div className="relative flex justify-center h-56">
          {props.image ? (
            <Image
              quality={100}
              layout="fill"
              alt={props.name}
              src={props.image}
              className="object-cover rounded"
            />
          ) : null}
          <div style={headerBackgroundStyles} className="w-full h-full rounded bg-slate-100" />
        </div>
        <div className="relative py-4 pb-1">
          <div className="flex items-start">
            <div className="relative w-10 h-10 mr-3 shrink-0">
              {props.pfp ? (
                <Image
                  layout="fill"
                  src={props.pfp}
                  alt={props.name}
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="h-full rounded-full bg-slate-100" />
              )}
            </div>
            <div className="text-lg font-semibold text-blue-1000">{props.name}</div>
          </div>
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm('Are you sure you want to cancel the registration?')) {
              props.onCancel();
            }
          }}
          className="absolute p-1 bg-white rounded-full top-5 right-5">
          <XMarkIcon className="w-3 h-3" />
        </div>
      </a>
    </Link>
  );
};
