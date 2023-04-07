const { axios, cheerio } = require("../utils/dependencies");

/**
 *
 * @param {string} url TikTok URL
 * @returns {Promise<string>}
 */
const ttdownloader = async (url) => {
  try {
    const request = await axios.get("https://ttdownloader.com/id/");
    const Cookie = request.headers["set-cookie"]
      .map((v) => v.split(";")[0])
      .join("; ");
    const $ = cheerio.load(request.data);
    let data = "";
    $("form input")
      .get()
      .forEach((v, i, a) => {
        const { name, value } = v.attribs;
        data += `${name}=${value ? value : encodeURI(url)}${
          i === a.length - 1 ? "&format=" : "&"
        }`;
      });
    const response = await axios({
      method: "POST",
      data,
      url: "https://ttdownloader.com/search/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie,
        Origin: "https://ttdownloader.com",
        Referer: "https://ttdownloader.com/id/",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = ttdownloader;
