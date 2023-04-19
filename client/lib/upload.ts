import axios, { AxiosResponse } from 'axios';

import fetcher from './fetcher';
import { toast } from 'react-hot-toast';

type Upload = {
  file: File;
};

export const upload = async ({ file }: Upload) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    return await fetcher<{ url: string }>({
      method: 'POST',
      data: formData,
      url: '/file/upload',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((data) => data.url);
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // We need to specify AxiosResponse here because
          // the build fails in CI/CD pipeline due to types
          // mismatch.
          const response = error.response as AxiosResponse;
          toast.error(response.data.message || 'Upload failed');
        }
      }

      throw error;
    }
  }
};

export const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { files } = event.target;
  if (!files) return;

  const file = files.item(0);
  if (!file) return;

  return upload({
    file,
  }).finally(() => {
    // Input caching the uploaded file
    // If you reset the state and try to upload the same file onChange won't run
    // so we need to reset it manually
    event.target.value = '';
  });
};
