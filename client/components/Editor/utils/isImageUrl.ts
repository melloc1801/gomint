import imageExtensions from 'image-extensions';
import isUrl from 'is-url';

export const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split('.').pop();
  return ext ? imageExtensions.includes(ext) : false;
};
