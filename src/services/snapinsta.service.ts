import axios from 'axios';
import { load } from 'cheerio';
import FormData from 'form-data';
import globalVariables from '../utils/globalVariables';
import decodeSnap from '../utils/decodeSnap';

export default async (inputUrl: string): Promise<string> => {
  try {
    // request token
    const requestToken = await axios({
      method: 'GET',
      url: 'https://snapinsta.app/id',
      headers: {
        "User-Agent": globalVariables.userAgent
      }
    });

    if (requestToken.status !== 200) {
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
      url: 'https://snapinsta.app/action2.php',
      data,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: 'https://snapinsta.app',
        Referer: 'https://snapinsta.app/id',
        'User-Agent':
          globalVariables.userAgent,
      },
    });

    if (requestScript.status !== 200) {
      throw new Error('Failed to get the script');
    }

    // TODO: get params
    const params = `${requestScript.data}`.match(/escape\(r\)\)}\((.*?)\)\)/)

    // validate params
    if (params === null) {
      throw new Error("Failed to get video params")
    }

    // split params
    const args = params[1]
      .split(',')
      .map(a => a.startsWith('"') && a.endsWith('"') ? a.slice(1, -1) : +a);

    // validate args
    if (args.length !== 6) {
      throw new Error("Failed to get args")
    }

    // TODO: decode script
    const decoded = decodeSnap(...args as [string, any, string, number, number, string]);

    // validate decoded
    if (decoded === null) {
      throw new Error("Failed to decode script")
    }

    // parse to json
    // return snaptikParserService(decoded.split("innerHTML = \"")[1].split("\"; ")[0].replace(/\\/g, ""));
    return decoded
  } catch (error: any) {
    throw new Error(error);
  }
};
