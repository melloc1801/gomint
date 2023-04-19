import { formatDistance, differenceInHours } from 'date-fns';

type ReturnType = {
  status: string;
  isActive: boolean;
};
export const useRegistrationTime = (
  registrationStart?: string,
  registrationEnd?: string
): ReturnType => {
  const registrationStartDate = registrationStart ? new Date(registrationStart || '') : null;
  const registrationEndDate = registrationEnd ? new Date(registrationEnd || '') : null;

  if (!registrationStartDate) {
    return {
      isActive: false,
      status: 'Not scheduled',
    };
  }

  const now = new Date();
  if (now < registrationStartDate) {
    const gap = Math.abs(differenceInHours(registrationStartDate, now));
    return {
      isActive: false,
      status:
        gap < 24
          ? `Registration will start ${formatDistance(registrationStartDate, now, {
              addSuffix: true,
            })} ago`
          : `Scheduled ${registrationStartDate.toLocaleString()}`,
    };
  }
  if (!registrationEndDate) {
    return {
      isActive: true,
      status: `Registration started since ${registrationStartDate.toLocaleString()}`,
    };
  }
  if (registrationEndDate < now) {
    const gap = Math.abs(differenceInHours(registrationEndDate, now));
    return {
      isActive: false,
      status:
        gap < 24
          ? `Registration ended ${formatDistance(registrationEndDate, now, {
              addSuffix: true,
            })}`
          : `Registration ended at ${registrationEndDate.toLocaleString()}`,
    };
  }

  const gap = Math.abs(differenceInHours(registrationEndDate, now));
  return {
    isActive: true,
    status:
      gap < 24
        ? `Registration will end ${formatDistance(registrationEndDate, now, {
            addSuffix: true,
          })}`
        : `${registrationStartDate.toLocaleString()} - ${registrationEndDate.toLocaleString()}`,
  };
};
