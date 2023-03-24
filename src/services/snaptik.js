const { default: axios } = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");
const decodeSnap = require("../functions/decodeSnap");

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

    const script = postDataResponse.data;
    const scriptPassCheck = /\}eval\(function/g.exec(script);
    if (!scriptPassCheck) {
      throw new Error("[404] Could not find executable script.");
    }

    const scriptParams = /escape\(r\)\)\}\((.*?)\)\)/
      .exec(script)[1]
      .split(",")
      .map((v) => (v.includes('"') ? v.slice(1, -1) : parseInt(v)));

    const [h, u, n, t, e, r] = scriptParams;
    const decodedSnap = decodeSnap(h, u, n, t, e, r);
    return decodedSnap;
  } catch (error) {
    throw error;
  }
};

module.exports = snaptik;
