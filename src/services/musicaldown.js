const { axios, cheerio } = require("../utils/dependencies");

/**
 *
 * @param {string} url TikTok URL
 * @param {boolean} music Include Music?
 * @returns {Promise<{ video: string | undefined, music: string | undefined }>}
 */
const musicaldown = async (url, music) => {
  try {
    const request = await axios.get("https://musicaldown.com/id");
    const Cookie = request.headers["set-cookie"]
      .map((v) => v.split(";")[0])
      .join("; ");
    const contentType = "application/x-www-form-urlencoded";
    const userAgent =
      "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0";
    const $ = cheerio.load(request.data);
    let data = "";
    let result = {};
    $("form input")
      .get()
      .forEach((v, i, a) => {
        const { name, value } = v.attribs;
        data += `${name}=${value ? value : encodeURI(url)}${
          i === a.length - 1 ? "" : "&"
        }`;
      });
    const responseVideo = await axios({
      method: "POST",
      data,
      url: "https://musicaldown.com/id/download",
      headers: {
        "Content-Type": contentType,
        Cookie,
        Origin: "https://musicaldown.com",
        Referer: "https://musicaldown.com/id",
        "User-Agent": userAgent,
      },
    });
    result.video = responseVideo.data;
    if (music) {
      const responseMusic = await axios({
        method: "POST",
        url: "https://musicaldown.com/id/mp3",
        headers: {
          "Content-Type": contentType,
          Cookie,
          Origin: "https://musicaldown.com",
          Referer: "https://musicaldown.com/id/download",
          "User-Agent": userAgent,
        },
      });
      result.music = responseMusic.data;
    }
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = musicaldown;
