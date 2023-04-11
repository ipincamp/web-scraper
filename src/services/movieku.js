const { axios, cheerio } = require("../utils/dependencies");

/**
 *
 * @param {string} query
 * @returns {Promise<{
 * id: string | undefined;
 * url: string | undefined;
 * title: string | undefined;
 * thumbnail: string | undefined;
 * genre: string;
 * dateCreated: string;
 * director: string;
 * }[]>}
 */
const advancedSearch = async (query) => {
  const search = query.replace(new RegExp(/ /, "g"), "+");
  const { data } = await axios({
    method: "GET",
    url: `https://107.152.37.223/?s=${search}`,
    headers: {
      Referer: "https://107.152.37.223/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
    },
  });
  const $ = cheerio.load(data);
  return $("div.los > article > .bx")
    .get()
    .map((v) => ({
      id: $(v).find("a").attr("rel"),
      url: $(v).find("a").attr("href"),
      title: $(v).find("a").attr("title"),
      thumbnail: $(v).find("a > .limit > img").attr("src"),
      genre: $(v).find(".note > .g").text().split(",").join(", "),
      dateCreated: $(v).find(".note > .t > time").text(),
      director: $(v).find(".note > .t > span > span > a").text(),
    }));
};

/**
 *
 * @returns {Promise<{
 * id: string | undefined;
 * url: string | undefined;
 * title: string | undefined;
 * thumbnail: string | undefined;
 * genre: string;
 * dateCreated: string;
 * director: string;
 * }[]>}
 */
const onGoing = async () => {
  const { data } = await axios.get("https://107.152.37.223/ongoing/");
  const $ = cheerio.load(data);
  return $("div.los > article > .bx")
    .get()
    .map((v) => ({
      id: $(v).find("a").attr("rel"),
      url: $(v).find("a").attr("href"),
      title: $(v).find("a").attr("title"),
      thumbnail: $(v).find("div.limit > img").attr("src"),
      genre: $(v).find(".note > .g").text().split(",").join(", "),
      dateCreated: $(v).find(".note > .t > time").text(),
      director: $(v)
        .find(".note > .t > span > span > a")
        .get()
        .map((v) => $(v).text())
        .join(", "),
    }));
};

/**
 *
 * @returns {Promise<{
 * category: string;
 * contents: {
 * id: string;
 * title: string;
 * url: string;
 * }[];
 * }[]>}
 */
const seriesList = async () => {
  const { data } = await axios.get("https://107.152.37.223/series-list/");
  const $ = cheerio.load(data);
  const categories = $("div.soralist > div")
    .get()
    .map((v) => {
      const category = $(v).find("span > a").text();
      const children = $(v)
        .find("ul > li > a")
        .get()
        .map((w) => ({
          id: w.attribs.rel,
          title: $(w).text(),
          url: w.attribs.href,
        }));
      return {
        category,
        contents: [...children],
      };
    });
  return categories.filter((v) => !!v.category);
};

const movieku = { advancedSearch, onGoing, seriesList };

module.exports = movieku;
