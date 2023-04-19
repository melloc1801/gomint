import { lowerCase, replace } from 'lodash';

export const createSlug = (name: string) => replace(lowerCase(name), /\s+/g, '-');

export const getPhaseActivityStatus = (
  registrationStart: Date | null,
  registrationEnd: Date | null
): 'finished' | 'active' | 'scheduled' | 'inactive' => {
  if (!registrationStart) {
    return 'inactive';
  }
  const ISONow = new Date(new Date().toISOString());
  const ISOStart = new Date(registrationStart.toISOString());
  const ISOEnd = registrationEnd ? new Date(registrationEnd.toISOString()) : null;

  if (ISONow > ISOStart) {
    if (ISOEnd && ISOEnd < ISONow) {
      return 'finished';
    } else {
      return 'active';
    }
  } else {
    return 'scheduled';
  }
};
