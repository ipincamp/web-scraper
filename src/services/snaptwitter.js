const { axios, cheerio, FormData } = require("../utils/dependencies");

/**
 *
 * @param {string} url Twitter URL
 * @returns {Promise<{ error: boolean, data: string | undefined }>}
 */
const snaptwitter = async (url) => {
  try {
    const request = await axios.get("https://snaptwitter.com/id");
    const $ = cheerio.load(request.data);
    const data = new FormData();
    $("form input")
      .get()
      .forEach((v) => {
        const { name, value } = v.attribs;
        data.append(name, value ? value : url);
      });
    const response = await axios({
      method: "POST",
      url: "https://snaptwitter.com/action.php",
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: "https://snaptwitter.com",
        Referer: "https://snaptwitter.com/id",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = snaptwitter;
