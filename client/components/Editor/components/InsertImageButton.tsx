import { PhotoIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { insertImage } from '../utils/insertImage';
import { isImageUrl } from '../utils/isImageUrl';
import toast from 'react-hot-toast';
import { upload } from '../../../lib/upload';
import { useSlateStatic } from 'slate-react';

export const InsertImageButton = () => {
  const editor = useSlateStatic();
  const fileUploadHandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast.error('Choose files');
      return;
    }
    const fileUrl = await upload({ file: e.target.files[0] });
    if (!fileUrl) {
      toast.error('Something went wrong. Try it later.');
      return;
    }

    if (!isImageUrl(fileUrl)) {
      toast.error("Image url doesn't ends with image extension");
      return;
    }
    insertImage(editor, fileUrl);
    e.target.value = '';
  };
  return (
    <label className="flex cursor-pointer" htmlFor="slate-image-input">
      <PhotoIcon className="w-6 h-6" />
      <input className="hidden" onInput={fileUploadHandle} id="slate-image-input" type="file" />
    </label>
  );
};
