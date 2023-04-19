import { CameraIcon } from '@heroicons/react/24/outline';
import { CloseCircle } from './CloseCircle';
import cx from 'classnames';

export const ProfilePicture = ({ url, onRemove }: { url?: string; onRemove: () => void }) => {
  const style = {
    backgroundImage: url ? `url('${url}')` : 'none',
  };

  const classNames = cx(
    {
      'hover:border-blue-500 hover:text-blue-500 text-slate-300 hover:bg-blue-25 active:border-blue-600 active:text-blue-600 border border-dashed':
        !url,
    },
    'flex items-center justify-center transition ease-in-out bg-cover bg-center rounded-full cursor-pointer w-28 h-28 group'
  );

  return (
    <div style={style} className={classNames}>
      {url ? <CloseCircle onRemove={onRemove} /> : <CameraIcon className="w-1/4 h-1/4" />}
    </div>
  );
};
