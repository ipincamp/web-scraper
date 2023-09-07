import axios from 'axios';
import { load } from 'cheerio';
import FormData from 'form-data';
import requestStatus from '../utils/requestStatus';
import globalVariables from '../utils/globalVariables';
import type IMusicaldownScrape from '../interfaces/musicaldown.type';

export default async (
  inputUrl: string,
  withAudio: boolean = false
): Promise<IMusicaldownScrape> => {
  try {
    const results: IMusicaldownScrape = {
      audio: '',
      video: '',
    };

    // request input & cookie
    const inputCookie = await axios({
      method: 'GET',
      url: 'https://musicaldown.com/id',
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
    });

    const isInputCookieSuccess = requestStatus(inputCookie);
    if (!isInputCookieSuccess) {
      throw new Error('Failed to get inputs or cookie');
    }

    // collect input data
    const $ = load(inputCookie.data);
    const data = new FormData();
    const Cookie = inputCookie.headers['set-cookie']
      ?.map((value) => value.split(';')[0])
      .join('; ');

    $('form input').map((_, { attribs }) => {
      const { name, value } = attribs;
      data.append(name, value ? value : inputUrl);
    });

    // request video
    const requestVideo = await axios({
      method: 'POST',
      url: 'https://musicaldown.com/id/download',
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie,
        Origin: 'https://musicaldown.com',
        Referer: 'https://musicaldown.com/id',
        'User-Agent': globalVariables.userAgent,
      },
    });

    const isRequestVideoSuccess = requestStatus(requestVideo);
    if (!isRequestVideoSuccess) {
      throw new Error('Failed to get video');
    }

    results.video = requestVideo.data;

    // request audio
    if (withAudio) {
      const requestAudio = await axios({
        method: 'POST',
        url: 'https://musicaldown.com/id/mp3',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie,
          Origin: 'https://musicaldown.com',
          Referer: 'https://musicaldown.com/id/download',
          'User-Agent': globalVariables.userAgent,
        },
      });

      const isRequestAudioSuccess = requestStatus(requestVideo);
      if (!isRequestAudioSuccess) {
        throw new Error('Failed to get audio');
      }

      results.audio = requestAudio.data;
    }

    return results;
  } catch (error: any) {
    throw new Error(error);
  }
};
