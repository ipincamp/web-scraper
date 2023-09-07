import { AxiosResponse } from 'axios';

export default (response: AxiosResponse): boolean => {
  return [200, 304].includes(response.status);
};
