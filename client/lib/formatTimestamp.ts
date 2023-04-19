import { formatISO } from 'date-fns';

export const formatTimestamp = (ts: string): string => new Date(ts).toISOString();
export const revertFormatTimestamp = (ts: string): string => {
  return formatISO(new Date(ts)).slice(0, ts.length - 8);
};
