import axios from 'axios';
import { load } from 'cheerio';
import FormData from 'form-data';
import requestStatus from '../utils/requestStatus';
import globalVariables from '../utils/globalVariables';

export default async (inputUrl: string): Promise<string> => {
  try {
    // request token
    const requestToken = await axios({
      method: 'GET',
      url: 'https://ssstik.io/en',
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
    });

    const isRequestTokenSuccess = requestStatus(requestToken);
    if (!isRequestTokenSuccess) {
      throw new Error('Failed to get tokens');
    }

    // collect input & token
    const $ = load(requestToken.data);
    const data = new FormData();
    const token = requestToken.data?.split('"tt:\'')[1]?.split('\'");')[0] as string | undefined
    if (!token) {
      throw new Error("Token not found");      
    }

    $('form input').map((_, { attribs }) => {
      const { name, value } = attribs;
      data.append(name, name === 'id' ? inputUrl : value);
    });
    data.append('tt', token)

    // request result
    const requestResult = await axios({
      method: 'POST',
      url: 'https://ssstik.io/abc?url=dl',
      data,
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
        Origin: 'https://ssstik.io',
        Referer: 'https://ssstik.io/en',
        'User-Agent': globalVariables.userAgent,
      },
    });

    const isRequestResultSuccess = requestStatus(requestResult);
    if (!isRequestResultSuccess) {
      throw new Error('Failed to get the result');
    }

    return requestResult.data as string
  } catch (error: any) {
    throw new Error(error);
  }
};
