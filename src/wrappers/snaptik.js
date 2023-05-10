const { cheerio } = require("../utils/dependencies");

const falsy = {
  status: false,
  result: null,
};

/**
 *
 * @param {string} payload
 * @returns {{
 *     status: boolean;
 *     result: {
 *         username: string;
 *         description: string;
 *         videourl: string[];
 *         imageurl: string[] | undefined;
 *     } | null;
 * }}
 */
const snaptik_wrap = (payload) => {
  try {
    const exist = /\)\.innerHTML = "/.test(payload);
    if (!exist) return falsy;
    const html = payload.match(/innerHTML = "(.*?)";/);
    if (!html) return falsy;
    const $ = cheerio.load(html[1].replace(new RegExp(/\\"/, "g"), '"'));

    /** Single Video */
    const result = {
      username: $("div.info > span").text(),
      description: $("div.info > div").text(),
      videourl: $("div.video-links > a")
        .get()
        .filter(({ attribs: { href } }) => href !== "/")
        .map(({ attribs: { href } }) =>
          href.startsWith("/") ? `https://snaptik.app${href}` : href
        ),
    };

    /** Slider */
    const hasImage = $('div[class="columns is-multiline mt-3"]').length;
    if (Boolean(hasImage)) {
      const imageurl = $('div[class="column is-one-third"]')
        .get()
        .map((v) => $(v).find("div > a").attr("href"));
      return {
        status: true,
        result: {
          ...result,
          imageurl,
        },
      };
    }
    return {
      status: true,
      result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = snaptik_wrap;
