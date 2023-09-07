import axios from 'axios';
import { load } from 'cheerio';
import FormData from 'form-data';
import SnapClass from '../classes/Snap.class';
import requestStatus from '../utils/requestStatus';
import globalVariables from '../utils/globalVariables';

export default async (inputUrl: string): Promise<string> => {
  try {
    // request token
    const requestToken = await axios({
      method: 'GET',
      url: 'https://snaptik.app/ID',
      headers: {
        "User-Agent": globalVariables.userAgent
      }
    });

    const isRequestTokenSuccess = requestStatus(requestToken);
    if (!isRequestTokenSuccess) {
      throw new Error('Failed to get tokens');
    }

    // collect input data
    const $ = load(requestToken.data);
    const data = new FormData();

    $('form input').map((_, { attribs }) => {
      const { name, value } = attribs;
      data.append(name, name === 'url' ? inputUrl : value);
    });

    // request script
    const requestScript = await axios({
      method: 'POST',
      url: 'https://snaptik.app/abc2.php',
      data,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: 'https://snaptik.app',
        Referer: 'https://snaptik.app/ID',
        'User-Agent': globalVariables.userAgent
      },
    });

    const isRequestScriptSuccess = requestStatus(requestScript);
    if (!isRequestScriptSuccess) {
      throw new Error('Failed to get the script');
    }

    // decode script
    return SnapClass.decode(requestScript.data as string);
  } catch (error: any) {
    throw new Error(error);
  }
};
