const { axios, FormData } = require("../utils/dependencies");
const { decode } = require("../class/Snap");

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

    return decode(request.data);
  } catch (error) {
    throw error;
  }
};

module.exports = snapsave;
