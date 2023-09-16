import axios from "axios";
import globalVariables from "../utils/globalVariables";
import requestStatus from "../utils/requestStatus";
import type ISaveIgJson from "../interfaces/saveig.type";

export default async (inputUrl: string): Promise<string> => {
  try {
    // request json data
    const requestJson = await axios({
      method: "POST",
      url: "https://v3.saveig.app/api/ajaxSearch",
      data: {
        q: encodeURI(inputUrl),
        t: "media",
        lang: "en",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://saveig.app",
        Referer: "https://saveig.app/",
        "User-Agent": globalVariables.userAgent,
      },
    });

    const isRequestJsonSuccess = requestStatus(requestJson);
    if (!isRequestJsonSuccess) {
      throw new Error("Failed to get json data");
    }

    // parse data
    const jsonData = requestJson.data as ISaveIgJson;

    if (!jsonData.data) {
      throw new Error(
        "Unable to get data. Please double check the url you submitted"
      );
    }

    return jsonData.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
