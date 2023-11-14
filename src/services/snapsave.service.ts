import axios from 'axios';
import FormData from 'form-data';
import globalVariables from '../utils/globalVariables';
import decodeSnap from '../utils/decodeSnap';

export default async (inputUrl: string): Promise<string> => {
  try {
    const data = new FormData();
    data.append('url', inputUrl);

    // request script
    const requestScript = await axios({
      method: 'POST',
      url: 'https://snapsave.app/action.php?lang=id',
      data,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: 'https://snapsave.app',
        Referer: 'https://snapsave.app/id',
        'User-Agent': globalVariables.userAgent,
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

    return decoded
  } catch (error: any) {
    throw new Error(error);
  }
};
