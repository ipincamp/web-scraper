import axios from 'axios';
import FormData from 'form-data';
import SnapClass from '../classes/Snap.class';
import requestStatus from '../utils/requestStatus';
import globalVariables from '../utils/globalVariables';

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
