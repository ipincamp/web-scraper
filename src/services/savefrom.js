const { default: axios } = require("axios");
const vm = require("vm");

/**
 *
 * @param {string} url
 * @returns {Promise<string>}
 */
const savefrom = async (url) => {
  try {
    const response = await axios({
      method: "POST",
      data: `sf_url=${encodeURI(
        url
      )}&sf_submit=&new=2&lang=id&app=&country=id&os=Ubuntu&browser=Firefox&channel=main&sf-nomad=1`,
      url: "https://worker.sf-tools.com/savefrom.php",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://id.savefrom.net",
        Referer: "https://id.savefrom.net/",
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
      },
    });
    let responseData = `${response.data}`;
    const execCode = '[]["filter"]["constructor"](b).call(a);';
    if (responseData.indexOf(execCode) === -1) {
      throw new Error("[404] Could not find executable script.");
    }
    responseData = responseData.replace(
      execCode,
      `
      try {
        const script = ${execCode.split(".call")[0]}.toString();
        if (script.includes('function showResult')) {
            scriptResult = script;
        } else {
            ${execCode.replace(/;/, "")};
        }
      } catch (error) {
        log(error);
      }
      `
    );
    const context = {
      scriptResult: "",
      log: console.info,
    };
    vm.createContext(context);
    new vm.Script(responseData).runInContext(context);
    return context.scriptResult;
  } catch (error) {
    throw error;
  }
};

module.exports = savefrom;
