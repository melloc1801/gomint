import { PhaseType } from './phase.utils.types';
import { get } from 'lodash';
import { getPhaseActivityStatus } from '../../project/utils/project.utils.helpers';

export const formatAddress = (address = '') => {
  return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
};

export const sortPhases = (phases: PhaseType[]) => {
  const sortByRegistrationStartDesc = (phaseA: PhaseType, phaseB: PhaseType) =>
    Number(new Date(phaseB.registrationStart!)) - Number(new Date(phaseA.registrationStart!));

  const sortByRegistrationStartAsc = (phaseA: PhaseType, phaseB: PhaseType) =>
    Number(new Date(phaseA.registrationStart!)) - Number(new Date(phaseB.registrationStart!));

  const sortByRegistrationEndDesc = (phaseA: PhaseType, phaseB: PhaseType) =>
    Number(new Date(phaseB.registrationEnd!)) - Number(new Date(phaseA.registrationEnd!));

  const phasesByStatus: Record<'active' | 'finished' | 'inactive' | 'scheduled', PhaseType[]> = {
    active: [],
    finished: [],
    inactive: [],
    scheduled: [],
  };

  phases.forEach((phase) => {
    const status = getPhaseActivityStatus(
      phase.registrationStart ? new Date(phase.registrationStart) : null,
      phase.registrationEnd ? new Date(phase.registrationEnd) : null
    );

    const statusPhases = get(phasesByStatus, status);
    statusPhases.push(phase);

    switch (status) {
      case 'active':
        statusPhases.sort(sortByRegistrationStartDesc);
        break;
      case 'scheduled':
        statusPhases.sort(sortByRegistrationStartAsc);
        break;
      case 'finished':
        statusPhases.sort(sortByRegistrationEndDesc);
        break;
      default:
        break;
    }
  });

  return phasesByStatus.active
    .concat(phasesByStatus.scheduled)
    .concat(phasesByStatus.finished)
    .concat(phasesByStatus.inactive);
};
