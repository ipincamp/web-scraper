import axios from 'axios';
import { load } from 'cheerio';
import requestStatus from '../utils/requestStatus';
import globalVariables from '../utils/globalVariables';
import type ITikdownScrape from '../interfaces/tikdown.type';

export default async (inputUrl: string): Promise<ITikdownScrape> => {
  try {
    // request token
    const requestToken = await axios({
      method: 'GET',
      url: 'https://tikdown.org/id',
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
    });

    const isRequestTokenSuccess = requestStatus(requestToken);
    if (!isRequestTokenSuccess) {
      throw new Error('Failed to get tokens');
    }

    // collect token
    const $ = load(requestToken.data);
    const token = $('form input[name="_token"]').val();
    if (token === undefined) {
      throw new Error("Token not found");      
    }

    // request result
    const requestResult = await axios({
      method: 'GET',
      url: 'https://tikdown.org/getAjax',
      data: {
        url: decodeURI(inputUrl),
        token,
      },
      headers: {
        Referer: 'https://tikdown.org/id',
        'User-Agent': globalVariables.userAgent,
      },
    });

    const isRequestResultSuccess = requestStatus(requestResult);
    if (!isRequestResultSuccess) {
      throw new Error('Failed to get the result');
    }

    return requestResult.data as ITikdownScrape;
  } catch (error: any) {
    throw new Error(error);
  }
};
