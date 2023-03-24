const { default: axios } = require("axios");
const FormData = require("form-data");
const decodeSnap = require("../functions/decodeSnap");

/**
 *
 * @param {string} url Facebook URL
 * @returns {Promise<string>}
 */
const snapsave = async (url) => {
  try {
    const data = new FormData();
    data.append("url", url);
    const request = await axios({
      method: "POST",
      data,
      url: "https://snapsave.app/action.php?lang=id",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: "https://snapsave.app",
        Referer: "https://snapsave.app/id",
        "User-Agent": "Chrome",
      },
    });

    const script = request.data;
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

module.exports = snapsave;
