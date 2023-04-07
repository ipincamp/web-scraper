const { axios, FormData } = require("../utils/dependencies");
const { decode } = require("../class/Snap");

/**
 *
 * @param {string} url Instagram URL
 * @returns {Promise<string>}
 */
const snapinsta = async (url) => {
  try {
    const data = new FormData();

    data.append("url", url);
    data.append("action", "post");
    data.append("lang", "id");

    const request = await axios({
      method: "POST",
      url: "https://snapinsta.app/action2.php",
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        Origin: "https://snapinsta.app",
        Referer: "https://snapinsta.app/id",
        "User-Agent": "Chrome",
      },
    });

    return decode(request.data);
  } catch (error) {
    throw error;
  }
};

module.exports = snapinsta;
