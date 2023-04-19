import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { log, queryClient } from '../pages/_app';

const instance = axios.create({
  baseURL: 'https://tonapi.io/v1/',
  withCredentials: true,
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error instanceof Error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          queryClient.invalidateQueries('profile');
        }
        if (error.response?.status === 403) {
          window?.location.replace(window?.location.origin + '/404');
        }
      }

      log.error(error);
    }
    throw error;
  }
);

export default function fetcher<JSON = unknown>(input: AxiosRequestConfig): Promise<JSON> {
  return instance(input).then((response: AxiosResponse<JSON>) => response.data);
}
