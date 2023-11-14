import axios from 'axios';
import { load } from 'cheerio';
import FormData from 'form-data';
import globalVariables from '../utils/globalVariables';
import type ISnaptwitterScrape from '../interfaces/snaptwitter.type';

export default async (inputUrl: string): Promise<ISnaptwitterScrape> => {
  try {
    // request token
    const requestToken = await axios({
      method: 'GET',
      url: 'https://snaptwitter.com/id',
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
    });

    if (requestToken.status !== 200) {
      throw new Error("Failed to get tokens")
    }

    // collect input data
    const $ = load(requestToken.data);
    const data = new FormData();

    $('form input').map((_, { attribs }) => {
      const { name, value } = attribs;
      data.append(name, name === 'url' ? inputUrl : value);
    });

    // request result
    const requestResult = await axios({
      method: 'POST',
      url: 'https://snaptwitter.com/action.php',
      data,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: 'https://snaptwitter.com',
        Referer: 'https://snaptwitter.com/id',
        'User-Agent': globalVariables.userAgent,
      },
    });

    if (requestResult.status !== 200) {
      throw new Error("Failed to get the result")
    }

    return requestResult.data as ISnaptwitterScrape;
  } catch (error: any) {
    throw new Error(error);
  }
};
