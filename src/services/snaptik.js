const { axios, cheerio, FormData } = require("../utils/dependencies");
const { decode } = require("../class/Snap");

/**
 *
 * @param {string} url TikTok URL
 * @returns {Promise<string>}
 */
const snaptik = async (url) => {
  try {
    const requestTokenResponse = await axios.get("https://snaptik.app/ID");
    const form = new FormData();
    const $ = cheerio.load(requestTokenResponse.data);

    const inputFields = $("form input").get();
    if (inputFields.length < 3) {
      throw new Error("[404] Could not find token.");
    }

    inputFields.forEach((inputField) => {
      const value = inputField.attribs.value ? inputField.attribs.value : url;
      form.append(inputField.attribs.name, value);
    });

    const postDataResponse = await axios({
      method: "POST",
      url: "https://snaptik.app/abc2.php",
      data: form,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
        Origin: "https://snaptik.app",
        Referer: "https://snaptik.app/ID",
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
      },
    });

    return decode(postDataResponse.data);
  } catch (error) {
    throw error;
  }
};

module.exports = snaptik;
