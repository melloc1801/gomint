import { XCircleIcon } from '@heroicons/react/24/solid';

export const CloseCircle = ({ onRemove }: { onRemove: () => void }) => (
  <div className="flex items-center justify-center w-8 h-8 transition-all ease-in-out rounded-full opacity-0 bg-opacity-60 bg-blue-1000 group-hover:opacity-100">
    <XCircleIcon
      className="w-5 h-5 text-white text-opacity-75"
      onClick={(e) => {
        e.preventDefault();
        onRemove();
      }}
    />
  </div>
);
