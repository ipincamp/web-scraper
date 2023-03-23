const { snaptik, savefrom } = require(".");

(async () => {
  const tiktok = await snaptik(
    "https://www.tiktok.com/@initokyolagii/video/7189917930761506075"
  );
  console.info(tiktok);

  const youtube = await savefrom("https://www.youtube.com/shorts/8dYeTq_qiIQ");
  console.info(youtube);
})();
