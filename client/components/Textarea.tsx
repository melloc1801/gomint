import React from 'react';
import cx from 'classnames';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};
export const Textarea: React.FC<TextareaProps> = ({ className, error, ...props }) => {
  return (
    <div className={className}>
      <textarea
        className={cx(
          { 'border-red-500': error },
          'block w-full p-4 rounded border border-slate-200 resize-y min-h-36 placeholder:text-sm placeholder:text-slate-400'
        )}
        {...props}
      />
      <div className="mt-1 mb-2 text-xs text-left text-red-500">
        {error ? error : null}
        &nbsp; {/* Empty space to maintain block height */}
      </div>
    </div>
  );
};
