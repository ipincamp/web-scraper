const snaptik = require(".");

(async () => {
  //! TikTok
  const response = await snaptik(
    "https://www.tiktok.com/@initokyolagii/video/7189917930761506075"
  );
  console.info(response);
})();
