const { axios, cheerio } = require("../utils/dependencies");

/**
 *
 * @param {string} url Twitter Video URL
 * @returns {Promise<string>}
 */
const twittervdl = async (url) => {
  try {
    const getCsrf = await axios.get("https://twittervideodownloader.com/");
    const $ = cheerio.load(getCsrf.data);
    const csrf = $('form input[name="csrfmiddlewaretoken"]').val();

    if (!csrf) {
      throw new Error("[404] Could not find CSRF token.");
    }

    const { data } = await axios({
      method: "POST",
      url: "https://twittervideodownloader.com/download",
      data: `csrfmiddlewaretoken=${csrf}&tweet=${decodeURI(url)}`,
      headers: {
        Cookie: getCsrf.headers["set-cookie"]
          .map((v) => v.split(";")[0])
          .join("; "),
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://twittervideodownloader.com",
        Referer: "https://twittervideodownloader.com/",
        "User-Agent": "Chrome",
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = twittervdl;
