import axios from 'axios';
import { load } from 'cheerio';
import FormData from 'form-data';
import globalVariables from '../utils/globalVariables';
import decodeSnap from '../utils/decodeSnap';
import snaptikParserService from './snaptikParser.service';
import { type SnaptikJson } from '../interfaces/snaptik.type';

export default async (inputUrl: string): Promise<SnaptikJson> => {
  try {
    // TODO: get token
    const requestToken = await axios.get('https://snaptik.app/ID', {
      headers: { "User-Agent": globalVariables.userAgent }
    });

    // validate response
    if (requestToken.status !== 200) {
      throw new Error("Failed to get token")
    }

    // collect input data
    const $ = load(requestToken.data);
    const formData = new FormData();

    // get value from input
    $('form input').map((_, { attribs }) => {
      const { name, value } = attribs;
      formData.append(name, name === 'url' ? inputUrl : value);
    });

    // set headers
    const headers = {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      Origin: 'https://snaptik.app',
      Referer: 'https://snaptik.app/ID',
      'User-Agent': globalVariables.userAgent
    }

    // TODO: get script
    const requestInfo = await axios.post("https://snaptik.app/abc2.php", formData, { headers })

    // validate response
    if (requestInfo.status !== 200) {
      throw new Error("Failed to get video info")
    }

    // TODO: get params
    const params = `${requestInfo.data}`.match(/escape\(r\)\)}\((.*?)\)\)/)

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
    return snaptikParserService(decoded.split("innerHTML = \"")[1].split("\"; ")[0].replace(/\\/g, ""));
  } catch (error: any) {
    throw new Error(error);
  }
};
