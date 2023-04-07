const { axios, cheerio } = require("../utils/dependencies");

/**
 *
 * @param {string} url TikTok URL
 * @returns {Promise<string>}
 */
const tikdown = async (url) => {
  try {
    const getToken = await axios.get("https://tikdown.org/id");
    const $ = cheerio.load(getToken.data);
    const _token = $('form input[name="_token"]').val();

    if (!_token) {
      throw new Error("[404] Could not find token.");
    }

    const { data } = await axios({
      method: "get",
      url: "https://tikdown.org/getAjax",
      data: { url: decodeURI(url), _token },
      headers: { "User-Agent": "Chrome" },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = tikdown;
