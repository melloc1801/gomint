import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TicketIcon, UserIcon } from '@heroicons/react/24/solid';

import { Circle } from '../../../components/Circle';
import { Menu } from '../../../components/Menu';
import { MenuItemButton } from '../../../components/MenuItemButton';
import { PhaseType } from '../utils/phase.utils.types';
import cx from 'classnames';
import { usePhase } from '../hooks/phase.hook';
import { useRegistrationTime } from '../../../hooks/useRegistrationTime';
import { useRouter } from 'next/router';

type PhaseItemProps = {
  active?: boolean;
  phase: PhaseType;
  onClick: () => void;
};

export const PhaseItem: React.FC<PhaseItemProps> = ({ phase, active, onClick }) => {
  const router = useRouter();
  const { slug } = router.query;
  const { del, duplicate } = usePhase(slug as string);
  const dateInfo = useRegistrationTime(phase.registrationStart, phase.registrationEnd);

  return (
    <div
      onClick={onClick}
      className={cx(
        'grid grid-cols-12 p-5 pr-5 border-b cursor-pointer md:p-7 border-slate-200 transition ease-in-out',
        active ? 'bg-blue-25 bg-opacity-75' : ''
      )}>
      <div className="flex col-span-11">
        <div className="flex">
          <Circle
            active={dateInfo.isActive}
            className={dateInfo.isActive ? 'text-gomint-green mt-2.5' : 'text-gomint-grey mt-2.5'}
          />

          <div>
            <h3 className="text-xl font-semibold">{phase.name}</h3>
            <div className="mt-4 text-sm">{dateInfo.status}</div>
            <div className="flex mt-4">
              <div className="flex mr-4 font-medium leading-5 text-gomint-dark-blue">
                <UserIcon className="w-5 h-5 mr-1.5 text-gomint-grey" />
                {phase.participantsCount}
              </div>
              <div
                className={cx(
                  phase.winnersCount ? 'text-gomint-orange' : 'text-gomint-grey',
                  'flex font-medium leading-5'
                )}>
                <TicketIcon className="w-5 h-5 mr-1.5" />
                {phase.winnersCount}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 justify-self-end">
        <Menu>
          <MenuItemButton
            icon={DocumentDuplicateIcon}
            onClick={() => {
              duplicate.mutateAsync({ id: phase.outerId });
            }}>
            Duplicate
          </MenuItemButton>
          <MenuItemButton
            icon={TrashIcon}
            className="text-red-500"
            iconClassName="!text-red-500"
            onClick={() => {
              if (
                window?.confirm(
                  'By deleting the access list, you permanently lose all associated data. Do you want to continue?'
                )
              ) {
                del.mutateAsync({ id: phase.outerId });
              }
            }}>
            Delete
          </MenuItemButton>
        </Menu>
      </div>
    </div>
  );
};
