import axios from "axios";
import globalVariables from "../utils/globalVariables";
import {
  type IY2mateConvertJson,
  type IY2mateApiResponse,
  type IY2mateVideoData,
  type IY2mateVideoInfo,
  IY2mateConvertResponse,
} from "../interfaces/y2mate.type";

export const y2mate_api = async (url: string): Promise<IY2mateApiResponse> => {
  try {
    // request json data
    const requestJsonData = await axios({
      method: "POST",
      url: "https://www.y2mate.com/mates/analyzeV2/ajax",
      data: {
        k_query: encodeURI(url),
        k_page: "home",
        hl: "en",
        q_auto: "0",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://www.y2mate.com",
        Referer: "https://www.y2mate.com/",
        "User-Agent": globalVariables.userAgent,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (requestJsonData.status !== 200) {
      throw new Error("Failed to get data")
    }

    // TODO: validate if error occured
    const jsonData = requestJsonData.data;

    if (jsonData.c_status !== undefined) {
      throw new Error(jsonData.mess);
    }

    const { a, links, t, title, vid } = jsonData as IY2mateVideoData;

    let formats: any[] = [];

    for (const [_, itags] of Object.entries(links)) {
      const childs: any[] = [];

      for (const [itag, props] of Object.entries(itags)) {
        const child: any = { itag };

        for (const [key, value] of Object.entries(props as IY2mateVideoInfo)) {
          child[key] = value;
        }

        childs.push(child);
      }

      formats.push(...childs);
    }

    const result = {
      vid,
      thumbnail: `https://i.ytimg.com/vi/${vid}/0.jpg`,
      title,
      duration: t,
      channel: a,
      formats: formats.map((v) => ({
        itag: v.itag,
        size: v.size,
        mime: v.f,
        quality: v.q,
        label: v.q_text,
        token: encodeURIComponent(v.k),
      })),
    };

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const y2mate_convert = async (
  videoId: string,
  tokenId: string
): Promise<IY2mateConvertResponse> => {
  try {
    // request json data
    const requestJsonData = await axios({
      method: "POST",
      url: "https://www.y2mate.com/mates/convertV2/index",
      data: { vid: videoId, k: decodeURIComponent(tokenId) },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://www.y2mate.com",
        Referer: `https://www.y2mate.com/youtube/${videoId}`,
        "User-Agent": globalVariables.userAgent,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (requestJsonData.status !== 200) {
      throw new Error("Failed to get data")
    }

    const jsonData = requestJsonData.data as IY2mateConvertJson;

    // TODO: invalid token validation
    if (jsonData.mess.length > 0) {
      throw new Error(jsonData.mess);
    }

    const { dlink, fquality, ftype, title, vid } = jsonData;

    return {
      vid,
      title: encodeURIComponent(title),
      mime: ftype,
      quality: fquality,
      url: dlink,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
